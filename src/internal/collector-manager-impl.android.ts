import { CollectorManager, PrepareError } from "./collector-manager";
import { MessagingProtocol } from "./messaging";
import { SensorCallback, SensorCallbackManager } from "./sensor-callback-manager";
import { CapabilityDiscoverer } from "./capability-discoverer.android";
import { NodeManager } from "./node-manager.android";
import { MessagingClient } from "./messaging/messaging-client";
import { ResolutionResult } from "./messaging/android/result-messaging-service.android";

export class CollectorManagerImpl implements CollectorManager {

    private _nodeManagers: Map<string, NodeManager>;

    private idsToBePrepared: string[] = [];
    private idsPrepared: string[] = [];

    constructor(
       private protocol: MessagingProtocol,
       private capability: string,
       private messagingClient: MessagingClient,
       private callbackManager: SensorCallbackManager,
    ) {
    }

    // TODO: re-think method name and signature, maybe return not ready nodes?
    async isReady(): Promise<boolean> {
        const nodes = await this.getAvailableNodes();
        if (nodes.size === 0) {
            return false;
        }

        const readyPromises: Promise<ResolutionResult>[] = [];
        nodes.forEach((node) => {
            readyPromises.push(node.isReady());
        });
        const readyResolutions = await Promise.all(readyPromises);
        readyResolutions.forEach((resolution) => {
            if (resolution.success) {
                this.idsPrepared.push(resolution.nodeId);
            } else {
                this.idsToBePrepared.push(resolution.nodeId);
            }
        });

        return this.idsToBePrepared.length === 0;
    }

    // TODO: re-think signature, maybe receive nodes to be prepared?
    async prepare(): Promise<PrepareError[]> {
        if (this.idsToBePrepared.length === 0) {
            return [];
        }

        const nodes = await this.getAvailableNodes();
        const preparePromises: Promise<ResolutionResult>[] = [];
        this.idsToBePrepared.forEach((id) => {
            const node = nodes.get(id);
            preparePromises.push(node.prepare());
        });

        const prepareResolutions = await Promise.all(preparePromises);
        const prepareErrors = [];
        prepareResolutions.forEach((resolution) => {
            if (resolution.success) {
                this.idsPrepared.push(resolution.nodeId);
            } else {
                prepareErrors.push({
                    node: nodes.get(resolution.nodeId).getNode(),
                    message: resolution.message,
                });
            }
        });

        return prepareErrors;
    }

    async startCollecting(): Promise<void> {
        const nodes = await this.getAvailableNodes();
        for (let id of this.idsPrepared) {
            await nodes.get(id).startCollecting();
        }
    }

    async stopCollecting(): Promise<void> {
        const nodes = await this.getAvailableNodes();
        for (let id of this.idsPrepared) {
            await nodes.get(id).stopCollecting();
        }
    }

    listenSensorUpdates(callback: SensorCallback): number {
        return this.callbackManager.add(callback);
    }

    stopListenSensorUpdates(listenerId?: number) {
        if (typeof listenerId === "number") {
            this.callbackManager.remove(listenerId);
        } else {
            this.callbackManager.removeAll();
        }
    }

    clearNodes() {
        this._nodeManagers = undefined;
        this.idsToBePrepared = [];
        this.idsPrepared = [];
    }

    private async getAvailableNodes(): Promise<Map<string, NodeManager>> {
        if (!this._nodeManagers) {
            const capabilityDiscoverer = new CapabilityDiscoverer(this.capability);
            const nodes = await capabilityDiscoverer.getAvailableNodes();
            this._nodeManagers = new Map<string, NodeManager>();
            const iterator = nodes.iterator();
            while (iterator.hasNext()) {
                const node = iterator.next();
                this._nodeManagers.set(
                    node.getId(),
                    new NodeManager(
                        node,
                        this.messagingClient,
                    )
                );
            }
        }
        return this._nodeManagers;
    }
}

import { CollectorManager, PrepareError } from "./collector-manager";
import { SensorRecord } from "./sensor-record";
import { MessagingProtocol } from "./messaging";
import { SensorCallback, SensorCallbackManager } from "./sensor-callback-manager";
import { OnMessageReceivedListener } from "./utils/android/wear-os-types.android";
import { CapabilityDiscoverer } from "./capability-discoverer.android";
import { ResolutionResult } from "./messaging/android/result-messaging-listener.android";
import { NodeManager } from "./node-manager.android";
import { MessagingClient } from "./messaging/messaging-client";

export class CollectorManagerImpl<T extends SensorRecord> implements CollectorManager {

    private _nodeManagers: Map<string, NodeManager>;

    private idsToBePrepared: string[] = [];
    private idsPrepared: string[] = [];

    constructor(
       private protocol: MessagingProtocol,
       private capability: string,
       private messagingClient: MessagingClient,
       private callbackManager: SensorCallbackManager<T>,
       private recordMessagingListener: OnMessageReceivedListener,
    ) {
    }

    // TODO: re-think method name and signature, maybe return not ready nodes?
    async isReady(): Promise<boolean> {
        const nodes = await this.getAvailableNodes();
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
        await this.messagingClient.registerMessageListener(this.recordMessagingListener);
        for (let id of this.idsPrepared) {
            await nodes.get(id).startCollecting();
        }
    }

    async stopCollecting(): Promise<void> {
        const nodes = await this.getAvailableNodes();
        for (let id of this.idsPrepared) {
            await nodes.get(id).stopCollecting();
        }
        await this.messagingClient.removeMessageListener(this.recordMessagingListener);
    }

    listenSensorUpdates(callback: SensorCallback) {
        this.callbackManager.add(callback);
    }

    stopListenSensorUpdates(listenerId?: number) {
        if (typeof listenerId === "number") {
            this.callbackManager.remove(listenerId);
        } else {
            this.callbackManager.removeAll();
        }
    }

    private async getAvailableNodes(): Promise<Map<string, NodeManager>> {
        if (!this._nodeManagers) {
            const capabilityDiscoverer = new CapabilityDiscoverer(this.capability);
            const nodes = await capabilityDiscoverer.getAvailableNodes();
            this._nodeManagers = new Map<string, NodeManager>();
            nodes.forEach((node) => {
                this._nodeManagers.set(
                    node.getId(),
                    new NodeManager(
                        node,
                        this.protocol,
                        this.messagingClient
                    )
                );
            });
        }
        return this._nodeManagers;
    }
}

import { CollectorManager } from "./collector-manager";
import { SensorRecord } from "./sensor-record";
import { MessagingProtocol, ResultMessagingProtocol } from "./messaging";
import { MessagingClientImpl } from "./messaging/android/messaging-client.android";
import { SensorCallback, SensorCallbackManager } from "./sensor-callback-manager";
import { NodeSet, OnMessageReceivedListener } from "./utils/android/wear-os-types.android";
import { CapabilityDiscoverer } from "./capability-discoverer.android";
import { ResultMessagingListener } from "./messaging/android/result-messaging-listener.android";

export class CollectorManagerImpl<T extends SensorRecord> implements CollectorManager {

    private _nodes: NodeSet;
    private messagingClient: MessagingClientImpl;

    constructor(
       private protocol: MessagingProtocol,
       private capability: string,
       private callbackManager: SensorCallbackManager<T>,
       private recordMessagingListener: OnMessageReceivedListener,
    ) {
        this.messagingClient = new MessagingClientImpl(this.protocol);
    }

    async isReady(): Promise<boolean> {
        const nodes = await this.getAvailableNodes();
        const resolutionPromise = this.createResolutionPromise(this.protocol.readyProtocol);
        await this.messagingClient.sendIsReadyMessage(nodes);
        return await resolutionPromise;
    }

    async prepare(): Promise<void> {
        const nodes = await this.getAvailableNodes();
        const resolutionPromise = this.createResolutionPromise(this.protocol.prepareProtocol);
        await this.messagingClient.sendPrepareMessage(nodes);

        const prepareResult = await resolutionPromise;
        if (!prepareResult) {
            throw new Error("Could not prepare WearOS sensor");
        }
    }

    async startCollecting(): Promise<void> {
        const nodes = await this.getAvailableNodes();
        await this.messagingClient.registerMessageListener(this.recordMessagingListener);
        await this.messagingClient.sendStartMessage(nodes);
    }

    async stopCollecting(): Promise<void> {
        const nodes = await this.getAvailableNodes();
        await this.messagingClient.sendStopMessage(nodes);
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

    private async getAvailableNodes(): Promise<NodeSet> {
        if (!this._nodes) {
            const capabilityDiscoverer = new CapabilityDiscoverer(this.capability);
            this._nodes = await capabilityDiscoverer.getAvailableNodes();
        }
        return this._nodes;
    }

    private createResolutionPromise(protocol: ResultMessagingProtocol): Promise<boolean> {
        return new Promise(async (resolve) => {
            await this.messagingClient.registerMessageListener(
                new ResultMessagingListener(
                    protocol,
                    () => resolve(true),
                    () => resolve(false),
                )
            );
        });
    }
}

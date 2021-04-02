import { CollectorManager } from "../../collector-manager";
import { MessagingProtocol, ResultMessagingProtocol } from "../../messaging";
import { ResultMessagingListener } from "../../messaging/android/result-messaging-listener.android";
import { SensorCallback, SensorCallbackManager } from "../../sensor-callback-manager";
import { AccelerometerSensorRecord } from "../record";
import { CapabilityDiscoverer } from "../../capability-discoverer.android";
import { NodeSet } from "../../wear-os-types.android";
import { buildAccelerometerMessagingProtocol } from "./protocol.android";
import { AbstractRecordMessagingListener } from "../../messaging/android/abstract-record-messaging-listener";
import { AccelerometerRecordMessagingListener } from "./record-messaging-listener.android";
import { MessagingClientImpl } from "../../messaging/android/messaging-client.android";

export class AndroidAccelerometerManager implements CollectorManager {

    private _nodes: NodeSet;
    private _recordMessagingListener: AbstractRecordMessagingListener<AccelerometerSensorRecord>;

    constructor(
        private protocol: MessagingProtocol = buildAccelerometerMessagingProtocol(),
        private messagingClient = new MessagingClientImpl(protocol),
        private callbackManager = new SensorCallbackManager<AccelerometerSensorRecord>("newAccelerometerRecord"),
        private capability: string = "accelerometer-sensor",
    ) {}

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
            throw new Error("Could not prepare WearOS accelerometer");
        }
    }

    async startCollecting(): Promise<void> {
        const nodes = await this.getAvailableNodes();
        const listener = this.getRecordMessagingListener();
        await this.messagingClient.registerMessageListener(listener);
        await this.messagingClient.sendStartMessage(nodes);
    }

    async stopCollecting(): Promise<void> {
        const nodes = await this.getAvailableNodes();
        const listener = this.getRecordMessagingListener();
        await this.messagingClient.sendStopMessage(nodes);
        await this.messagingClient.removeMessageListener(listener);
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

    private getRecordMessagingListener(): AbstractRecordMessagingListener<AccelerometerSensorRecord> {
        if (!this._recordMessagingListener) {
            this._recordMessagingListener = new AccelerometerRecordMessagingListener(this.protocol, this.callbackManager);
        }
        return this._recordMessagingListener;
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

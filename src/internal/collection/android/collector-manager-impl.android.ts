import { CollectorManager, PrepareError } from "../collector-manager";
import { SensorCallback, SensorCallbackManager } from "../../sensor-callback-manager";
import { Node } from "../../node";
import { MessagingClient } from "../../communication/messaging/messaging-client";
import { SensorType } from "../../sensors/sensor-type";
import { CollectionConfiguration, configAsString, defaultCollectionConfiguration } from "../collection-configuration";

export class CollectorManagerImpl implements CollectorManager {

    constructor(
       private sensor: SensorType,
       private messagingClient: MessagingClient,
       private callbackManager: SensorCallbackManager,
    ) {
    }

    private hasCapability(node: Node): boolean {
        return node.capabilities.indexOf(this.sensor) !== -1;
    }

    async isReady(node: Node): Promise<boolean> {
        if (!this.hasCapability(node)) {
            return false;
        }

        const result = await this.messagingClient.sendIsReadyMessage(node);

        return result.success;
    }

    async prepare(node: Node): Promise<PrepareError> {
        if (!this.hasCapability(node))
            return {
                node: node,
                message: `Node ${node.name} (${node.id}) has not ${this.sensor} available`
            };

        const result = await this.messagingClient.sendPrepareMessage(node);

        if (result.success)
            return undefined;
        else {
            return {
                node: node,
                message: result.message
            };
        }
    }

    async startCollecting(node: Node, config?: CollectionConfiguration): Promise<void> {
        if (!this.hasCapability(node))
            return;

        const message = config ? configAsString(config) : configAsString(defaultCollectionConfiguration(this.sensor));
        await this.messagingClient.sendStartMessage(node, message);
    }

    async stopCollecting(node: Node): Promise<void> {
        if (!this.hasCapability(node))
            return;

        await this.messagingClient.sendStopMessage(node);
    }

    listenSensorUpdates(callback: SensorCallback): number {
        return this.callbackManager.add(callback, this.sensor);
    }

    stopListenSensorUpdates(listenerId?: number) {
        if (typeof listenerId === "number") {
            this.callbackManager.remove(listenerId);
        } else {
            this.callbackManager.removeAllForEvent(this.sensor);
        }
    }
}

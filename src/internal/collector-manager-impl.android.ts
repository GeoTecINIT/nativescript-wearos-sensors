import { CollectorManager, PrepareError } from "./collector-manager";
import { SensorCallback, SensorCallbackManager } from "./sensor-callback-manager";
import { Node } from "./node/node.android";
import { MessagingClient } from "./communication/messaging/messaging-client";
import { SensorType } from "./sensors/sensor-type";

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

    // TODO: re-think method name and signature, maybe return not ready nodes?
    async isReady(node: Node): Promise<boolean> {
        if (!this.hasCapability(node)) {
            console.log("No tiene la capability");
            return false;
        }

        console.log("Voy a enviar el mensaje");
        const result = await this.messagingClient.sendIsReadyMessage(node);

        return result.success;
    }

    // TODO: re-think signature, maybe receive nodes to be prepared?
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

    async startCollecting(node: Node): Promise<void> {
        if (!this.hasCapability(node))
            return;

        await this.messagingClient.sendStartMessage(node);
    }

    async stopCollecting(node: Node): Promise<void> {
        if (!this.hasCapability(node))
            return;

        await this.messagingClient.sendStopMessage(node);
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
}

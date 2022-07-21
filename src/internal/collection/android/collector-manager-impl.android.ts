import { CollectorManager, PrepareError } from "../collector-manager";
import {
    getSensorListenerManager,
    ListenerFilter,
    SensorListener,
    SensorListenerManager
} from "../../sensor-listener-manager";
import { Node } from "../../node";
import { MessagingClient } from "../../communication/messaging/messaging-client";
import { SensorType } from "../../sensors/sensor-type";
import { CollectionConfiguration, configAsString, defaultCollectionConfiguration } from "../collection-configuration";

export class CollectorManagerImpl implements CollectorManager {

    constructor(
       private sensor: SensorType,
       private messagingClient: MessagingClient,
       private listenerManager: SensorListenerManager = getSensorListenerManager(),
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

    addSensorListener(listener: SensorListener, filters?: ListenerFilter): number {
        return this.listenerManager.add(listener, filters);
    }

    removeSensorListener(listenerId?: number) {
        if (typeof listenerId === "number") {
            this.listenerManager.remove(listenerId);
        } else {
            this.listenerManager.removeAll();
        }
    }
}

import { CollectorManager, PrepareError } from "../collector-manager";
import {
    getSensorListenerManager,
    ListenerFilter,
    SensorListener,
    SensorListenerManager
} from "../../sensor-listener-manager";
import { Node } from "../../node";
import { SensorType } from "../../sensors/sensor-type";
import { CollectionConfiguration, configAsString, defaultCollectionConfiguration } from "../collection-configuration";
import { getMessagingClient } from "../../communication/messaging/android/messaging-client.android";
import { getEnabledSensors } from "../enabled-sensors";

export class CollectorManagerImpl implements CollectorManager {

    private _enabledSensors: SensorType[];
    get enabledSensors() {
        if (!this._enabledSensors) {
            this._enabledSensors = getEnabledSensors();
        }
        return this._enabledSensors;
    }

    constructor(
        private messagingClient = (sensor) => getMessagingClient(sensor),
        private listenerManager: SensorListenerManager = getSensorListenerManager(),
    ) {
    }

    isEnabled(sensor: SensorType): boolean {
        return this.enabledSensors.indexOf(sensor) !== -1;
    }

    async isReady(node: Node, sensor: SensorType): Promise<boolean> {
        if (!hasCapability(node, sensor) || !this.isEnabled(sensor)) {
            return false;
        }

        const result = await this.messagingClient(sensor).sendIsReadyMessage(node);

        return result.success;
    }

    async prepare(node: Node, sensor: SensorType): Promise<PrepareError> {
        if (!hasCapability(node, sensor))
            return {
                node: node,
                message: `Node ${node.name} (${node.id}) has not ${sensor} available`
            };

        if (!this.isEnabled(sensor)) {
            return {
                node: node,
                message: `${sensor} is not enabled at plugin initialization`
            };
        }

        const result = await this.messagingClient(sensor).sendPrepareMessage(node);

        if (result.success)
            return undefined;
        else {
            return {
                node: node,
                message: result.message
            };
        }
    }

    async startCollecting(node: Node, sensor: SensorType, config?: CollectionConfiguration): Promise<void> {
        if (!hasCapability(node, sensor) || !this.isEnabled(sensor))
            return;

        const message = config ? configAsString(sensor, config) : configAsString(sensor, defaultCollectionConfiguration(sensor));
        await this.messagingClient(sensor).sendStartMessage(node, message);
    }

    async stopCollecting(node: Node, sensor: SensorType): Promise<void> {
        if (!hasCapability(node, sensor) || !this.isEnabled(sensor))
            return;

        await this.messagingClient(sensor).sendStopMessage(node, sensor);
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

function hasCapability(node: Node, sensor: SensorType): boolean {
    return node.capabilities.indexOf(sensor) !== -1;
}

let _instance: CollectorManager;
export function getAndroidCollectorManager(): CollectorManager {
    if (!_instance) {
        _instance = new CollectorManagerImpl();
    }
    return _instance;
}

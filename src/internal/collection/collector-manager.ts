import { ListenerFilter, SensorListener } from "../sensor-listener-manager";
import { Node } from "../node";
import { CollectionConfiguration } from "./collection-configuration";
import { SensorType } from "../sensors/sensor-type";

export interface CollectorManager {
    isReady(node: Node, sensor: SensorType): Promise<boolean>;
    prepare(node: Node, sensor: SensorType): Promise<PrepareError>;
    startCollecting(node: Node, sensor: SensorType, config?: CollectionConfiguration): Promise<void>;
    stopCollecting(node: Node, sensor: SensorType): Promise<void>;
    addSensorListener(listener: SensorListener, filters?: ListenerFilter): number;
    removeSensorListener(listenerId?: number);
}

export interface PrepareError {
    node: Node;
    message: string;
}

import { ListenerFilter, SensorListener } from "../sensor-listener-manager";
import { Node } from "../node";
import { CollectionConfiguration } from "./collection-configuration";

export interface CollectorManager {
    isReady(node: Node): Promise<boolean>;
    prepare(node: Node): Promise<PrepareError>;
    startCollecting(node: Node, config?: CollectionConfiguration): Promise<void>;
    stopCollecting(node: Node): Promise<void>;
    addSensorListener(listener: SensorListener, filters?: ListenerFilter): number;
    removeSensorListener(listenerId?: number);
}

export interface PrepareError {
    node: Node;
    message: string;
}

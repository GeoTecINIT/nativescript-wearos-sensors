import { SensorCallback } from "./sensor-callback-manager";
import { Node } from "./node/node.android";

export interface CollectorManager {
    isReady(node: Node): Promise<boolean>;
    prepare(node: Node): Promise<PrepareError>;
    startCollecting(node: Node): Promise<void>;
    stopCollecting(node: Node): Promise<void>;
    listenSensorUpdates(callback: SensorCallback): number;
    stopListenSensorUpdates(listenerId?: number);
}

export interface PrepareError {
    node: Node;
    message: string;
}

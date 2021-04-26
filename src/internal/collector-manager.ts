import { SensorCallback } from "./sensor-callback-manager";
import { Node } from "./utils/android/wear-os-types.android";

export interface CollectorManager {
    isReady(): Promise<boolean>;
    prepare(): Promise<PrepareError[]>;
    startCollecting(): Promise<void>;
    stopCollecting(): Promise<void>;
    listenSensorUpdates(callback: SensorCallback): number;
    stopListenSensorUpdates(listenerId?: number);
    clearNodes();
}

export interface PrepareError {
    node: Node;
    message: string;
}

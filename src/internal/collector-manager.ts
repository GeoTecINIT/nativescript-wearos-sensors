import { SensorCallback } from "./sensor-callback-manager";

export interface CollectorManager {
    isReady(): Promise<boolean>;
    prepare(): Promise<void>;
    startCollecting(): Promise<void>;
    stopCollecting(): Promise<void>;
    listenSensorUpdates(callback: SensorCallback);
    stopListenSensorUpdates(listenerId?: number);
}

import { Common, WearosSensorsConfig } from './wearos-sensors.common';
import { SensorType } from "./internal/sensors/sensor-type";
export declare class WearosSensors extends Common {
    init(config?: WearosSensorsConfig): Promise<void>;
}
export declare const wearosSensors: WearosSensors;
export declare const allSensors: SensorType[];
export declare const defaultConfig: WearosSensorsConfig;

export { WearosSensorsConfig } from './wearos-sensors.common';

import { Common, WearosSensorsConfig } from './wearos-sensors.common';
export declare class WearosSensors extends Common {
    init(config?: WearosSensorsConfig): Promise<void>;
}
export declare const wearosSensors: WearosSensors;
export { WearosSensorsConfig, allSensors, defaultConfig } from './wearos-sensors.common';

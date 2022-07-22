import { Common, defaultConfig, WearosSensorsConfig } from './wearos-sensors.common';

class WearosSensors extends Common {
    public async init(config: WearosSensorsConfig = defaultConfig): Promise<void> {
        throw new Error("plugin not supported for iOS devices!!");
    }
}

export const wearosSensors = new WearosSensors();
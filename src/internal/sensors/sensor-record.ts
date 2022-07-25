import { SensorSample } from "./sample";
import { SensorType } from "./sensor-type";

export interface SensorRecord<T extends SensorSample> {
    type: SensorType;
    deviceId: string;
    samples: T[];
}

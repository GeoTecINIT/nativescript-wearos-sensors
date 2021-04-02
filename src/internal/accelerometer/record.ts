import { SensorRecord } from "../sensor-record";

export interface AccelerometerSensorRecord extends SensorRecord {
    x: number;
    y: number;
    z: number;
}

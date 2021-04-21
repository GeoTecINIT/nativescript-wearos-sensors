import { SensorRecord } from "../sensor-record";

export interface TriAxialSensorRecord extends SensorRecord {
    x: number;
    y: number;
    z: number;
}

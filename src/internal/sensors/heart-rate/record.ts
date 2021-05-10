import {SensorRecord} from "../sensor-record";

export interface HeartRateSensorRecord extends SensorRecord {
    value: number;
}

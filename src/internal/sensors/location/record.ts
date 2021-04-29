import { SensorRecord } from "../sensor-record";

export interface LocationSensorRecord extends SensorRecord {
    latitude: number;
    longitude: number;
    altitude: number;
}

import { SensorType } from "./sensor-type";

export interface SensorRecord {
    deviceName: string;
    timestamp: Date;
}

export interface SensorRecords<T extends SensorRecord> {
    type: SensorType;
    records: T[];
}

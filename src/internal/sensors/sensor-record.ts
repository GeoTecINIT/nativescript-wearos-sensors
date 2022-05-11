import { SensorType } from "./sensor-type";

export interface SensorRecord {
    deviceId: string;
    timestamp: number;
}

export interface SensorRecords<T extends SensorRecord> {
    type: SensorType;
    records: T[];
}

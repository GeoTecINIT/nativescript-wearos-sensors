export interface SensorRecord {
    deviceName: string;
    timestamp: Date;
}

export interface TriAxialSensorRecord extends SensorRecord {
    x: number;
    y: number;
    z: number;
}

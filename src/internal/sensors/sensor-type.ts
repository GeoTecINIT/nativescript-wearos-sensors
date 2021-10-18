export enum SensorType {
    ACCELEROMETER = "ACCELEROMETER",
    GYROSCOPE = "GYROSCOPE",
    MAGNETOMETER = "MAGNETOMETER",
    LOCATION = "LOCATION",
    HEART_RATE = "HEART_RATE",
}

export function fromString(value: string): SensorType {
    switch (value.toLowerCase()) {
        case "accelerometer":
            return SensorType.ACCELEROMETER;
        case "gyroscope":
            return SensorType.GYROSCOPE;
        case "magnetometer":
            return SensorType.MAGNETOMETER;
        case "location":
            return SensorType.LOCATION;
        case "heart_rate":
            return SensorType.HEART_RATE;
        default:
            return null;
    }
}

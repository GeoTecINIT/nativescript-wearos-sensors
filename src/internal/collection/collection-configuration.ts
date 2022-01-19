import {SensorType} from "../sensors/sensor-type";

export interface CollectionConfiguration {
    sensorDelay: SensorDelay;
    batchSize: number;
}

export enum SensorDelay {
    UI = android.hardware.SensorManager.SENSOR_DELAY_UI,
    NORMAL = android.hardware.SensorManager.SENSOR_DELAY_NORMAL,
    GAME = android.hardware.SensorManager.SENSOR_DELAY_GAME,
    FASTEST = android.hardware.SensorManager.SENSOR_DELAY_FASTEST,
}

export function configAsString(collectionConfiguration: CollectionConfiguration) {
    return `${collectionConfiguration.sensorDelay}#${collectionConfiguration.batchSize}`;
}

export function defaultCollectionConfiguration(sensorType: SensorType): CollectionConfiguration {
    switch (sensorType) {
        case SensorType.ACCELEROMETER:
        case SensorType.GYROSCOPE:
        case SensorType.MAGNETOMETER:
            return {
                sensorDelay: SensorDelay.NORMAL,
                batchSize: 50
            };
        case SensorType.LOCATION:
        case SensorType.HEART_RATE:
            return {
                sensorDelay: SensorDelay.NORMAL,
                batchSize: 5
            };
    }
}

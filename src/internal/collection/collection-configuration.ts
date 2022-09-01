import { SensorType } from "../sensors/sensor-type";

export type SensorInterval = NativeSensorDelay | number;

export interface CollectionConfiguration {
    sensorInterval: SensorInterval;
    batchSize: number;
}

export enum NativeSensorDelay {
    UI = android.hardware.SensorManager.SENSOR_DELAY_UI,
    NORMAL = android.hardware.SensorManager.SENSOR_DELAY_NORMAL,
    GAME = android.hardware.SensorManager.SENSOR_DELAY_GAME,
    FASTEST = android.hardware.SensorManager.SENSOR_DELAY_FASTEST,
}

export function defaultCollectionConfiguration(sensorType: SensorType): CollectionConfiguration {
    switch (sensorType) {
        case SensorType.ACCELEROMETER:
        case SensorType.GYROSCOPE:
        case SensorType.MAGNETOMETER:
            return {
                sensorInterval: NativeSensorDelay.NORMAL,
                batchSize: 50
            };
        case SensorType.HEART_RATE:
            return {
                sensorInterval: NativeSensorDelay.NORMAL,
                batchSize: 5
            };
        case SensorType.LOCATION:
            return {
                sensorInterval: 1000,
                batchSize: 5
            };
    }
}

export function configAsString(sensor: SensorType, collectionConfiguration: CollectionConfiguration) {
    const intervalValue = sensorIntervalToNativeValue(sensor, collectionConfiguration.sensorInterval);
    return `${intervalValue}#${collectionConfiguration.batchSize}`;
}

function sensorIntervalToNativeValue(sensor: SensorType, sensorInterval: SensorInterval) {
    switch (sensorInterval) {
        case NativeSensorDelay.UI:
        case NativeSensorDelay.NORMAL:
        case NativeSensorDelay.GAME:
        case NativeSensorDelay.FASTEST:
            return sensorInterval;
        default:
            return sensor === SensorType.LOCATION
                ? sensorInterval
                : sensorInterval * 1000; // Native sensors API expects interval in microseconds
    }
}

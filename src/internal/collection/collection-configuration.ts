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

export const defaultCollectionConfiguration: CollectionConfiguration = {
    sensorDelay: SensorDelay.NORMAL,
    batchSize: 50,
};

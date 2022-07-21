import { SensorType } from "../../sensors/sensor-type";
import { WearableConfig } from "../../sensors/wearable-config";
import { CollectorManager } from "../collector-manager";
import { AbstractRecordMessagingService } from "../../communication/messaging/android/abstract-record-messaging-service.android";
import { buildMessagingProtocol } from "../../communication/messaging/protocol";
import { getSensorListenerManager } from "../../sensor-listener-manager";
import { MessagingClientImpl } from "../../communication/messaging/android/messaging-client.android";
import { getResultMessagingService } from "../../communication/messaging/android/messaging-result-service.android";
import { CollectorManagerImpl } from "./collector-manager-impl.android";
import {
    getAccelerometerDefaultWearableConfig,
    getAccelerometerRecordService
} from "../../sensors/triaxial/accelerometer/android/index.android";
import {
    getGyroscopeDefaultWearableConfig,
    getGyroscopeRecordService
} from "../../sensors/triaxial/gyroscope/android/index.android";
import {
    getMagnetometerDefaultWearableConfig,
    getMagnetometerRecordService
} from "../../sensors/triaxial/magnetometer/android/index.android";
import {
    getLocationDefaultWearableConfig,
    getLocationRecordService
} from "../../sensors/location/android/index.android";
import {
    getHeartRateDefaultWearableConfig,
    getHeartRateRecordService
} from "../../sensors/heart-rate/android/index.android";

export function getAndroidCollectorManager(
    sensorType: SensorType,
    config?: WearableConfig
): CollectorManager {
    const wearableConfig = config
        ? config
        : getDefaultWearableConfig(sensorType);

    const protocol = buildMessagingProtocol(wearableConfig.messagingPrefixPath);
    const listenerManager = getSensorListenerManager();
    const messagingClient = new MessagingClientImpl(
        protocol,
        getResultMessagingService(sensorType)
    );
    const recordService = getRecordsService(sensorType);
    recordService.setProtocol(protocol);
    recordService.setListenerManager(listenerManager);

    return new CollectorManagerImpl(
        sensorType,
        messagingClient,
        listenerManager
    );
}

function getRecordsService(sensorType: SensorType): AbstractRecordMessagingService {
    switch (sensorType) {
        case SensorType.ACCELEROMETER:
            return getAccelerometerRecordService();
        case SensorType.GYROSCOPE:
            return getGyroscopeRecordService();
        case SensorType.MAGNETOMETER:
            return getMagnetometerRecordService();
        case SensorType.LOCATION:
            return getLocationRecordService();
        case SensorType.HEART_RATE:
            return getHeartRateRecordService();
        default:
            return null;
    }
}

function getDefaultWearableConfig(sensorType: SensorType): WearableConfig {
    switch (sensorType) {
        case SensorType.ACCELEROMETER:
            return getAccelerometerDefaultWearableConfig();
        case SensorType.GYROSCOPE:
            return getGyroscopeDefaultWearableConfig();
        case SensorType.MAGNETOMETER:
            return getMagnetometerDefaultWearableConfig();
        case SensorType.LOCATION:
            return getLocationDefaultWearableConfig();
        case SensorType.HEART_RATE:
            return getHeartRateDefaultWearableConfig();
        default:
            return null;
    }
}

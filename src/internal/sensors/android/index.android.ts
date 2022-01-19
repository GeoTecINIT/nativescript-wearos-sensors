import { SensorType } from "../sensor-type";
import { WearableConfig } from "../index";
import { CollectorManager } from "../../collection/collector-manager";
import { AbstractRecordMessagingService } from "../../communication/messaging/android/abstract-record-messaging-service.android";
import { buildMessagingProtocol } from "./protocol.android";
import { getSensorCallbackManager } from "../../sensor-callback-manager";
import { MessagingClientImpl } from "../../communication/messaging/android/messaging-client.android";
import { getResultMessagingService } from "../../communication/messaging/android/messaging-result-service.android";
import { CollectorManagerImpl } from "../../collection/collector-manager-impl.android";
import {
    getAccelerometerDefaultWearableConfig,
    getAccelerometerRecordService
} from "../triaxial/accelerometer/android/index.android";
import {
    getGyroscopeDefaultWearableConfig,
    getGyroscopeRecordService
} from "../triaxial/gyroscope/android/index.android";
import {
    getMagnetometerDefaultWearableConfig,
    getMagnetometerRecordService
} from "../triaxial/magnetometer/android/index.android";
import {
    getLocationDefaultWearableConfig,
    getLocationRecordService
} from "../location/android/index.android";
import {
    getHeartRateDefaultWearableConfig,
    getHeartRateRecordService
} from "../heart-rate/android/index.android";

export function getAndroidSensorCollector(
    sensorType: SensorType,
    config?: WearableConfig
): CollectorManager {
    const wearableConfig = config
        ? config
        : getDefaultWearableConfig(sensorType);

    const protocol = buildMessagingProtocol(wearableConfig.messagingPrefixPath);
    const callback = getSensorCallbackManager();
    const messagingClient = new MessagingClientImpl(
        protocol,
        getResultMessagingService(sensorType)
    );
    const recordService = getRecordsService(sensorType);
    recordService.setProtocol(protocol);
    recordService.setCallbackManager(callback);

    return new CollectorManagerImpl(
        sensorType,
        messagingClient,
        callback
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

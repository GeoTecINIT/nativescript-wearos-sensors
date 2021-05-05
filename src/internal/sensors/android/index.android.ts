import { SensorType } from "../sensor-type";
import { WearableConfig } from "../index";
import { CollectorManager } from "../../collector-manager";
import { AbstractRecordMessagingService } from "../../messaging/android/abstract-record-messaging-service.android";
import { buildMessagingProtocol } from "./protocol.android";
import { SensorCallbackManager } from "../../sensor-callback-manager";
import { MessagingClientImpl } from "../../messaging/android/messaging-client.android";
import { getResultMessagingService } from "../../messaging/android/result-messaging-service.android";
import { CollectorManagerImpl } from "../../collector-manager-impl.android";
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

export function getAndroidSensorCollector(
    sensorType: SensorType,
    config?: WearableConfig
): CollectorManager {
    const wearableConfig = config
        ? config
        : getDefaultWearableConfig(sensorType);

    const protocol = buildMessagingProtocol(wearableConfig.messagingPrefixPath);
    const callback = new SensorCallbackManager(sensorType);
    const messagingClient = new MessagingClientImpl(
        protocol,
        getResultMessagingService()
    );
    const recordService = getRecordsService(sensorType);
    recordService.setProtocol(protocol);
    recordService.setCallbackManager(callback);

    return new CollectorManagerImpl(
        protocol,
        wearableConfig.capability,
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
        default:
            return null;
    }
}

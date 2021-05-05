import { Application } from "@nativescript/core";
import { SensorType } from "./sensor-type";
import { CollectorManager } from "../collector-manager";
import { getAndroidSensorCollector } from "./android/index.android";

export function getSensorCollector(
    sensorType: SensorType,
    config?: WearableConfig
): CollectorManager {
    if (Application.android) {
        return getAndroidSensorCollector(sensorType, config);
    } else {
        return null;
    }
}

export interface WearableConfig {
    capability: string;
    messagingPrefixPath: string;
}

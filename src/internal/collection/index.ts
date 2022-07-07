import { SensorType } from "../sensors/sensor-type";
import { CollectorManager } from "./collector-manager";
import { Application } from "@nativescript/core";
import { getAndroidCollectorManager } from "./android/index.android";
import { WearableConfig } from "../sensors/wearable-config";

export function getCollectorManager(
    sensorType: SensorType,
    config?: WearableConfig
): CollectorManager {
    if (Application.android) {
        return getAndroidCollectorManager(sensorType, config);
    } else {
        return null;
    }
}
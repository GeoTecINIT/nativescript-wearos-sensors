import { Application } from "@nativescript/core";
import { CollectorManager } from "../../../collector-manager";
import { getAndroidAccelerometerCollector } from "./android/index.android";

export function getAccelerometerCollector(): CollectorManager {
    if (Application.android) {
        return getAndroidAccelerometerCollector();
    } else {
        return null;
    }
}

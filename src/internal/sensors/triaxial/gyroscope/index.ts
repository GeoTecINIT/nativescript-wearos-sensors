import { Application } from "@nativescript/core";
import { CollectorManager } from "../../../collector-manager";
import { getAndroidGyroscopeCollector } from "./android/index.android";

export function getGyroscopeCollector(): CollectorManager {
    if (Application.android) {
        return getAndroidGyroscopeCollector();
    } else {
        return null;
    }
}

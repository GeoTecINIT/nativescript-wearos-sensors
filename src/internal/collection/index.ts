import { CollectorManager } from "./collector-manager";
import { Application } from "@nativescript/core";
import { getAndroidCollectorManager } from "./android/collector-manager-impl.android";

export function getCollectorManager(): CollectorManager {
    if (Application.android) {
        return getAndroidCollectorManager();
    } else {
        return null;
    }
}
import { Application } from "@nativescript/core";
import { CollectorManager } from "../../collector-manager";
import { getAndroidLocationCollector } from "./android/index.android";

export function getLocationCollector(): CollectorManager {
    if (Application.android) {
        return getAndroidLocationCollector();
    } else {
        return null;
    }
}

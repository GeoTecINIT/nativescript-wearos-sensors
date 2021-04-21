import { CollectorManager } from "../../../collector-manager";
import { android as androidApp } from "tns-core-modules/application/application";
import { getAndroidGyroscopeCollector } from "./android/index.android";

export function getGyroscopeCollector(): CollectorManager {
    if (androidApp) {
        return getAndroidGyroscopeCollector();
    } else {
        return null;
    }
}

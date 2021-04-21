import { CollectorManager } from "../../../collector-manager";
import { android as androidApp } from "tns-core-modules/application/application";
import { getAndroidAccelerometerCollector } from "./android/index.android";

export function getAccelerometerCollector(): CollectorManager {
    if (androidApp) {
        return getAndroidAccelerometerCollector();
    } else {
        return null;
    }
}

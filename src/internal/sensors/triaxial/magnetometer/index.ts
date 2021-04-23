import { android as androidApp } from "tns-core-modules/application/application";
import { getAndroidMagnetometerCollector } from "./android/index.android";

export function getMagnetometerCollector() {
    if (androidApp) {
        return getAndroidMagnetometerCollector();
    } else {
        return null;
    }
}

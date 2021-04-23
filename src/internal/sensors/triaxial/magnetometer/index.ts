import { Application } from "@nativescript/core";
import { getAndroidMagnetometerCollector } from "./android/index.android";

export function getMagnetometerCollector() {
    if (Application.android) {
        return getAndroidMagnetometerCollector();
    } else {
        return null;
    }
}

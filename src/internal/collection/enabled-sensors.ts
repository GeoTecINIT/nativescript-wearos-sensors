import { SensorType } from "../sensors/sensor-type";
import { flush, getString, setString } from "@nativescript/core/application-settings";

const ENABLED_SENSORS = "ENABLED_SENSORS_KEY";

let _enabledSensors;
export function setEnabledSensors(sensors: SensorType[]): void {
    _enabledSensors = sensors;
    setString(ENABLED_SENSORS, JSON.stringify(sensors));
    flush();
}

export function getEnabledSensors(): SensorType[] {
    if (!_enabledSensors) {
        _enabledSensors = JSON.parse(getString(ENABLED_SENSORS));
    }
    return _enabledSensors;
}
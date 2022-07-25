import { SensorType } from "../sensors/sensor-type";

let _enabledSensors;

export function setEnabledSensors(sensors: SensorType[]): void {
    _enabledSensors = sensors;
}

export function getEnabledSensors(): SensorType[] {
    return _enabledSensors;
}
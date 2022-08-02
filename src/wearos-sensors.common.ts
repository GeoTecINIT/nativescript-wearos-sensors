import { Observable } from "@nativescript/core";
import { SensorType } from "./internal/sensors/sensor-type";


export class Common extends Observable {
  public async init(config: WearosSensorsConfig): Promise<void> {
  }
}

export const allSensors = [
  SensorType.ACCELEROMETER,
  SensorType.GYROSCOPE,
  SensorType.MAGNETOMETER,
  SensorType.HEART_RATE,
  SensorType.LOCATION
];

export interface WearosSensorsConfig {
  sensors?: SensorType[];
  disablePlainMessaging?: boolean;
  disableWearCommands?: boolean;
}

export const defaultConfig = {
  sensors: allSensors,
};

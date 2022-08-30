import { SensorSample } from "../sample";

export interface LocationSensorSample extends SensorSample {
    latitude: number;
    longitude: number;
    altitude: number;
    verticalAccuracy: number;
    horizontalAccuracy: number;
    speed: number;
    direction: number;
}

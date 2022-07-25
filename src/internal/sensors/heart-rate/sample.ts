import { SensorSample } from "../sample";

export interface HeartRateSensorSample extends SensorSample {
    value: number;
}

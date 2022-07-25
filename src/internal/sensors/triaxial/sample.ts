import { SensorSample } from "../sample";

export interface TriAxialSensorSample extends SensorSample {
    x: number;
    y: number;
    z: number;
}

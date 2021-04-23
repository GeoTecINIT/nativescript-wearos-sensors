import { SensorType } from "./sensor-type";
import { CollectorManager } from "../collector-manager";
import { getAccelerometerCollector } from "./triaxial/accelerometer";
import { getGyroscopeCollector } from "./triaxial/gyroscope";
import { getMagnetometerCollector } from "./triaxial/magnetometer";

export function getSensorCollector(wearSensor: SensorType): CollectorManager {
    switch (wearSensor) {
        case SensorType.ACCELEROMETER:
            return getAccelerometerCollector();
        case SensorType.GYROSCOPE:
            return getGyroscopeCollector();
        case SensorType.MAGNETOMETER:
            return getMagnetometerCollector();
        default:
            return null;
    }
}

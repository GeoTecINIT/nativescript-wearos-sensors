import { SensorType } from "./sensor-type";
import { CollectorManager } from "../collector-manager";
import { getAccelerometerCollector } from "./triaxial/accelerometer";
import { getGyroscopeCollector } from "./triaxial/gyroscope";
import { getMagnetometerCollector } from "./triaxial/magnetometer";
import { getLocationCollector } from "./location";

export function getSensorCollector(wearSensor: SensorType): CollectorManager {
    switch (wearSensor) {
        case SensorType.ACCELEROMETER:
            return getAccelerometerCollector();
        case SensorType.GYROSCOPE:
            return getGyroscopeCollector();
        case SensorType.MAGNETOMETER:
            return getMagnetometerCollector();
        case SensorType.LOCATION:
            return getLocationCollector();
        default:
            return null;
    }
}

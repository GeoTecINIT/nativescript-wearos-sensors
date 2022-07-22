import { SensorType } from "./sensor-type";
import {
    AbstractRecordMessagingService
} from "../communication/messaging/android/abstract-record-messaging-service.android";
import { getAccelerometerRecordService } from "./triaxial/accelerometer/android/record-messaging-service.android";
import { getGyroscopeRecordService } from "./triaxial/gyroscope/android/record-messaging-service.android";
import { getMagnetometerRecordService } from "./triaxial/magnetometer/android/record-messaging-service.android";
import { getHeartRateRecordService } from "./heart-rate/android/record-messaging-service.android";
import { getLocationRecordService } from "./location/android/record-messaging-service.android";

export function getSensorRecordService(sensor: SensorType): AbstractRecordMessagingService {
    switch (sensor) {
        case SensorType.ACCELEROMETER:
            return getAccelerometerRecordService();
        case SensorType.GYROSCOPE:
            return getGyroscopeRecordService();
        case SensorType.MAGNETOMETER:
            return getMagnetometerRecordService();
        case SensorType.HEART_RATE:
            return getHeartRateRecordService();
        case SensorType.LOCATION:
            return getLocationRecordService();
        default:
            return undefined;
    }
}
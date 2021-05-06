import { Common } from './wearos-sensors.common';

import { getResultMessagingService } from "./internal/messaging/android/result-messaging-service.android";
import { getAccelerometerRecordService } from "./internal/sensors/triaxial/accelerometer/android/record-messaging-service.android";
import { getGyroscopeRecordService } from "./internal/sensors/triaxial/gyroscope/android/record-messaging-service.android";
import { getMagnetometerRecordService } from "./internal/sensors/triaxial/magnetometer/android/record-messaging-service.android";
import { getLocationRecordService } from "./internal/sensors/location/android/record-messaging-service.android";
import { getHeartRateRecordService } from "./internal/sensors/heart-rate/android/record-messaging-service.android";

import WearableListenerServiceDelegate = es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate;
import WearosSensorsResultsMessagingService = es.uji.geotec.wearos_sensors.messaging.WearosSensorsResultsMessagingService;
import WearosSensorsRecordsMessagingService = es.uji.geotec.wearos_sensors.messaging.WearosSensorsRecordsMessagingService;
import WearSensor = es.uji.geotec.wearos_sensors.WearSensor;

export class WearosSensors extends Common {
    async init(): Promise<void> {
        this.wireUpAccelerometerComponents();
        this.wireUpGyroscopeComponents();
        this.wireUpMagnetometerComponents();
        this.wireUpLocationComponents();
        this.wireUpHeartRateComponents();
        await super.init();
    }

    public wireUpAccelerometerComponents() {
        WearosSensorsResultsMessagingService.setResultServiceDelegate(
            WearSensor.ACCELEROMETER,
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getResultMessagingService().onMessageReceived(messageEvent)
            })
        );
        WearosSensorsRecordsMessagingService.setRecordServiceDelegate(
            WearSensor.ACCELEROMETER,
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getAccelerometerRecordService().onMessageReceived(messageEvent)
            })
        );
    }

    public wireUpGyroscopeComponents() {
        WearosSensorsResultsMessagingService.setResultServiceDelegate(
            WearSensor.GYROSCOPE,
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getResultMessagingService().onMessageReceived(messageEvent)
            })
        );
        WearosSensorsRecordsMessagingService.setRecordServiceDelegate(
            WearSensor.GYROSCOPE,
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getGyroscopeRecordService().onMessageReceived(messageEvent)
            })
        );
    }

    public wireUpMagnetometerComponents() {
        WearosSensorsResultsMessagingService.setResultServiceDelegate(
            WearSensor.MAGNETOMETER,
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getResultMessagingService().onMessageReceived(messageEvent)
            })
        );
        WearosSensorsRecordsMessagingService.setRecordServiceDelegate(
            WearSensor.MAGNETOMETER,
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getMagnetometerRecordService().onMessageReceived(messageEvent)
            })
        );
    }

    public wireUpLocationComponents() {
        WearosSensorsResultsMessagingService.setResultServiceDelegate(
            WearSensor.LOCATION,
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getResultMessagingService().onMessageReceived(messageEvent)
            })
        );
        WearosSensorsRecordsMessagingService.setRecordServiceDelegate(
            WearSensor.LOCATION,
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getLocationRecordService().onMessageReceived(messageEvent)
            })
        );
    }

    public wireUpHeartRateComponents() {
        WearosSensorsResultsMessagingService.setResultServiceDelegate(
            WearSensor.HEART_RATE,
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getResultMessagingService().onMessageReceived(messageEvent)
            })
        );
        WearosSensorsRecordsMessagingService.setRecordServiceDelegate(
            WearSensor.HEART_RATE,
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getHeartRateRecordService().onMessageReceived(messageEvent)
            })
        );
    }
}

export const wearosSensors = new WearosSensors();

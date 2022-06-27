import { Common } from './wearos-sensors.common';

import { getCapabilityAdvertiserResultService } from "./internal/communication/capabilities/android/capability-advertiser-result-service.android";
import { getResultMessagingService } from "./internal/communication/messaging/android/messaging-result-service.android";
import { getAccelerometerRecordService } from "./internal/sensors/triaxial/accelerometer/android/record-messaging-service.android";
import { getGyroscopeRecordService } from "./internal/sensors/triaxial/gyroscope/android/record-messaging-service.android";
import { getMagnetometerRecordService } from "./internal/sensors/triaxial/magnetometer/android/record-messaging-service.android";
import { getLocationRecordService } from "./internal/sensors/location/android/record-messaging-service.android";
import { getHeartRateRecordService } from "./internal/sensors/heart-rate/android/record-messaging-service.android";
import { getCommandService } from "./internal/communication/command/command-service.android";
import {
    getFreeMessageResultService
} from "./internal/communication/free-message/android/free-message-result-service.android";

import { SensorType } from "./internal/sensors/sensor-type";

import WearableListenerServiceDelegate = es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate;
import WearosSensorsCapabilityAdvertiserService = es.uji.geotec.wearos_sensors.messaging.WearosSensorsCapabilityAdvertiserService;
import WearosSensorsResultsMessagingService = es.uji.geotec.wearos_sensors.messaging.WearosSensorsResultsMessagingService;
import WearosSensorsRecordsMessagingService = es.uji.geotec.wearos_sensors.messaging.WearosSensorsRecordsMessagingService;
import WearosSensorsCommandService = es.uji.geotec.wearos_sensors.command.WearosCommandService;
import WearosFreeMessageService = es.uji.geotec.wearos_sensors.freemessage.WearosFreeMessageService;
import WearSensor = es.uji.geotec.wearos_sensors.WearSensor;

export class WearosSensors extends Common {
    init(): void {
        super.init();

        this.wireUpCapabilityAdvertiser();
        this.wireUpCommandService();
        this.wireUpFreeMessageService();
        this.wireUpAccelerometerComponents();
        this.wireUpGyroscopeComponents();
        this.wireUpMagnetometerComponents();
        this.wireUpLocationComponents();
        this.wireUpHeartRateComponents();
    }

    public wireUpCapabilityAdvertiser() {
        WearosSensorsCapabilityAdvertiserService.setCapabilityAdvertiserDelegate(
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getCapabilityAdvertiserResultService().onMessageReceived(messageEvent)
            })
        );
    }

    public wireUpCommandService() {
        WearosSensorsCommandService.setCommandServiceDelegate(
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getCommandService().onMessageReceived(messageEvent)
            })
        );
    }

    public wireUpFreeMessageService() {
        WearosFreeMessageService.setFreeMessageServiceDelegate(
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getFreeMessageResultService().onMessageReceived(messageEvent)
            })
        );
    }

    public wireUpAccelerometerComponents() {
        WearosSensorsResultsMessagingService.setResultServiceDelegate(
            WearSensor.ACCELEROMETER,
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getResultMessagingService(SensorType.ACCELEROMETER).onMessageReceived(messageEvent)
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
                    getResultMessagingService(SensorType.GYROSCOPE).onMessageReceived(messageEvent)
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
                    getResultMessagingService(SensorType.MAGNETOMETER).onMessageReceived(messageEvent)
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
                    getResultMessagingService(SensorType.LOCATION).onMessageReceived(messageEvent)
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
                    getResultMessagingService(SensorType.HEART_RATE).onMessageReceived(messageEvent)
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

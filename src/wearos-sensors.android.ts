import { Common } from './wearos-sensors.common';

import { getResultMessagingService } from "./internal/messaging/android/result-messaging-service.android";
import { getAccelerometerRecordService } from "./internal/sensors/triaxial/accelerometer/android/record-messaging-service.android";
import { getGyroscopeRecordService } from "./internal/sensors/triaxial/gyroscope/android/record-messaging-service.android";

import WearableListenerServiceDelegate = es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate;
import WearosSensorsResultsMessagingService = es.uji.geotec.wearos_sensors.messaging.WearosSensorsResultsMessagingService;
import WearosSensorsRecordsMessagingService = es.uji.geotec.wearos_sensors.messaging.WearosSensorsRecordsMessagingService;
import WearSensor = es.uji.geotec.wearos_sensors.WearSensor;

export class WearosSensors extends Common {
    async init(): Promise<void> {
        this.wireUpAccelerometerComponents();
        this.wireUpGyroscopeComponents();
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
}

export const wearosSensors = new WearosSensors();

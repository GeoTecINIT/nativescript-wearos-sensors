import { Common } from './wearos-sensors.common';

import { getResultMessagingService } from "./internal/messaging/android/result-messaging-service.android";
import AccelerometerResultMessageService = es.uji.geotec.wearos_sensors.messaging.AccelerometerResultMessageService;
import GyroscopeResultMessageService = es.uji.geotec.wearos_sensors.messaging.GyroscopeResultMessageService;

import { getAccelerometerRecordService } from "./internal/sensors/triaxial/accelerometer/android/record-messaging-service.android";
import AccelerometerRecordsMessagingService = es.uji.geotec.wearos_sensors.messaging.AccelerometerRecordsMessagingService;

import { getGyroscopeRecordService } from "./internal/sensors/triaxial/gyroscope/android/record-messaging-service.android";
import GyroscopeRecordsMessagingService = es.uji.geotec.wearos_sensors.messaging.GyroscopeRecordsMessagingService;


import WearableListenerServiceDelegate = es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate;

export class WearosSensors extends Common {
    async init(): Promise<void> {
        this.wireUpAccelerometerComponents();
        this.wireUpGyroscopeComponents();
        await super.init();
    }

    public wireUpAccelerometerComponents() {
        AccelerometerResultMessageService.setMessageListenerServiceDelegate(
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getResultMessagingService().onMessageReceived(messageEvent)
            })
        );
        AccelerometerRecordsMessagingService.setMessageListenerServiceDelegate(
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getAccelerometerRecordService().onMessageReceived(messageEvent)
            })
        );
    }

    public wireUpGyroscopeComponents() {
        GyroscopeResultMessageService.setMessageListenerServiceDelegate(
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getResultMessagingService().onMessageReceived(messageEvent)
            })
        );
        GyroscopeRecordsMessagingService.setMessageListenerServiceDelegate(
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getGyroscopeRecordService().onMessageReceived(messageEvent)
            })
        );
    }
}

export const wearosSensors = new WearosSensors();

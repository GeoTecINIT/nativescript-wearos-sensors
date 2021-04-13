import { Common } from './wearos-sensors.common';

import { getResultMessagingService } from "./internal/messaging/android/result-messaging-service.android";
import AccelerometerResultMessageService = es.uji.geotec.wearos_sensors.messaging.AccelerometerResultMessageService;

import { getAccelerometerRecordService } from "./internal/accelerometer/android/record-messaging-service.android";
import AccelerometerRecordsMessagingService = es.uji.geotec.wearos_sensors.messaging.AccelerometerRecordsMessagingService;

import WearableListenerServiceDelegate = es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate;

export class WearosSensors extends Common {
    async init(): Promise<void> {
        this.wireUpNativeComponents();
        await super.init();
    }

    public wireUpNativeComponents() {
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
}

export const wearosSensors = new WearosSensors();

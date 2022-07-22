import { Common, defaultConfig, WearosSensorsConfig } from './wearos-sensors.common';

import { getCapabilityAdvertiserResultService } from "./internal/communication/capabilities/android/capability-advertiser-result-service.android";
import { getResultMessagingService } from "./internal/communication/messaging/android/messaging-result-service.android";
import { getSensorRecordService } from "./internal/sensors/records-service";
import { getCommandService } from "./internal/communication/command/command-service.android";
import { getFreeMessageResultService } from "./internal/communication/free-message/android/free-message-result-service.android";

import { SensorType } from "./internal/sensors/sensor-type";

import WearableListenerServiceDelegate = es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate;
import WearosSensorsCapabilityAdvertiserService = es.uji.geotec.wearos_sensors.messaging.WearosSensorsCapabilityAdvertiserService;
import WearosSensorsResultsMessagingService = es.uji.geotec.wearos_sensors.messaging.WearosSensorsResultsMessagingService;
import WearosSensorsRecordsMessagingService = es.uji.geotec.wearos_sensors.messaging.WearosSensorsRecordsMessagingService;
import WearosSensorsCommandService = es.uji.geotec.wearos_sensors.command.WearosCommandService;
import WearosFreeMessageService = es.uji.geotec.wearos_sensors.freemessage.WearosFreeMessageService;
import WearSensor = es.uji.geotec.wearos_sensors.WearSensor;
import { setEnabledSensors } from "./internal/collection/enabled-sensors";
import { setFreeMessagesEnabled } from "./internal/communication/free-message";

class WearosSensors extends Common {
    public async init(config: WearosSensorsConfig = defaultConfig): Promise<void> {
        this.wireUpCapabilityAdvertiser();

        setEnabledSensors(config.sensors);
        if (config.sensors && config.sensors.length > 0) {
            this.wireUpSensorComponents(config.sensors);
        }

        if (!config.disableWearCommands) {
            this.wireUpCommandService();
        }

        setFreeMessagesEnabled(!config.disableFreeMessaging);
        if (!config.disableFreeMessaging) {
            this.wireUpFreeMessageService();
        }
    }

    private wireUpCapabilityAdvertiser(): void {
        WearosSensorsCapabilityAdvertiserService.setCapabilityAdvertiserDelegate(
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getCapabilityAdvertiserResultService().onMessageReceived(messageEvent)
            })
        );
    }

    private wireUpSensorComponents(sensors: SensorType[]): void {
        sensors.forEach((sensor) => {
            WearosSensorsResultsMessagingService.setResultServiceDelegate(
                sensorTypeToWearSensor(sensor),
                new WearableListenerServiceDelegate({
                    onMessageReceived: (messageEvent) =>
                        getResultMessagingService(sensor).onMessageReceived(messageEvent)
                })
            );
            WearosSensorsRecordsMessagingService.setRecordServiceDelegate(
                sensorTypeToWearSensor(sensor),
                new WearableListenerServiceDelegate({
                    onMessageReceived: (messageEvent) =>
                        getSensorRecordService(sensor).onMessageReceived(messageEvent)
                })
            );
        });
    }

    private wireUpCommandService(): void {
        WearosSensorsCommandService.setCommandServiceDelegate(
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getCommandService().onMessageReceived(messageEvent)
            })
        );
    }

    private wireUpFreeMessageService(): void {
        WearosFreeMessageService.setFreeMessageServiceDelegate(
            new WearableListenerServiceDelegate({
                onMessageReceived: (messageEvent) =>
                    getFreeMessageResultService().onMessageReceived(messageEvent)
            })
        );
    }
}

function sensorTypeToWearSensor(sensorType: SensorType): WearSensor {
    switch (sensorType) {
        case SensorType.ACCELEROMETER:
            return WearSensor.ACCELEROMETER;
        case SensorType.GYROSCOPE:
            return WearSensor.GYROSCOPE;
        case SensorType.MAGNETOMETER:
            return WearSensor.MAGNETOMETER;
        case SensorType.HEART_RATE:
            return WearSensor.HEART_RATE;
        case SensorType.LOCATION:
            return WearSensor.LOCATION;
        default:
            return undefined;
    }
}

export const wearosSensors = new WearosSensors();

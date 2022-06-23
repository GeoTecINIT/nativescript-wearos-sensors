import { AbstractRecordMessagingService } from "../../../communication/messaging/android/abstract-record-messaging-service.android";
import { wearOS } from "../../../utils/android/wear-os-types.android";
import { SensorRecord } from "../../sensor-record";
import { HeartRateSensorSample } from "../sample";
import { SensorType } from "../../sensor-type";
import ByteBuffer = java.nio.ByteBuffer;

export class HeartRateRecordMessagingService extends AbstractRecordMessagingService {

    decodeSamples(messageEvent: wearOS.MessageEvent): SensorRecord<HeartRateSensorSample> {
        const buff = ByteBuffer.wrap(messageEvent.getData());
        const size = buff.getInt();
        let value, time;

        const samples: HeartRateSensorSample[] = [];
        for (let i = 0; i < size; i++) {
            value = buff.getInt();
            time = buff.getLong();

            samples.push({
                timestamp: time,
                value,
            });
        }

        return {
            type: SensorType.HEART_RATE,
            deviceId: messageEvent.getSourceNodeId(),
            samples: samples,
        };
    }
}

let _heartRateRecordMessagingService;
export function getHeartRateRecordService(): AbstractRecordMessagingService {
    if (!_heartRateRecordMessagingService) {
        _heartRateRecordMessagingService = new HeartRateRecordMessagingService();
    }
    return _heartRateRecordMessagingService;
}

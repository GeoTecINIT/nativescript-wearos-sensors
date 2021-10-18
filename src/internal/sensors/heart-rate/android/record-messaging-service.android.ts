import { AbstractRecordMessagingService } from "../../../communication/messaging/android/abstract-record-messaging-service.android";
import { wearOS } from "../../../utils/android/wear-os-types.android";
import { SensorRecords } from "../../sensor-record";
import { HeartRateSensorRecord } from "../record";
import { SensorType } from "../../sensor-type";
import ByteBuffer = java.nio.ByteBuffer;

export class HeartRateRecordMessagingService extends AbstractRecordMessagingService {

    decodeRecords(messageEvent: wearOS.MessageEvent): SensorRecords<HeartRateSensorRecord> {
        const buff = ByteBuffer.wrap(messageEvent.getData());
        const size = buff.getInt();
        let value, time;

        const records: HeartRateSensorRecord[] = [];
        for (let i = 0; i < size; i++) {
            value = buff.getInt();
            time = buff.getLong();

            records.push({
                deviceName: messageEvent.getSourceNodeId(),
                timestamp: new Date(time),
                value,
            });
        }

        return {
            type: SensorType.HEART_RATE,
            records,
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

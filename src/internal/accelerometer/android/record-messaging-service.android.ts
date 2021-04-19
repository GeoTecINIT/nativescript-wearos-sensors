import { AbstractRecordMessagingService } from "../../messaging/android/abstract-record-messaging-service.android";
import { AccelerometerSensorRecord } from "../record";
import { MessagingProtocol } from "../../messaging";
import { SensorCallbackManager } from "../../sensor-callback-manager";
import { wearOS } from "../../utils/android/wear-os-types.android";

import ByteBuffer = java.nio.ByteBuffer;

export class AccelerometerRecordMessagingService extends AbstractRecordMessagingService<AccelerometerSensorRecord> {

    decodeRecords(messageEvent: wearOS.MessageEvent): AccelerometerSensorRecord[] {
        const buff = ByteBuffer.wrap(messageEvent.getData());
        const size = buff.getInt();
        let x, y, z, time;

        const records: AccelerometerSensorRecord[] = [];
        for (let i = 0; i < size; i++) {
            x = buff.getFloat();
            y = buff.getFloat();
            z = buff.getFloat();
            time = buff.getLong();
            records.push({
                deviceName: messageEvent.getSourceNodeId(),
                timestamp: new Date(time),
                x,
                y,
                z,
            });
        }

        return records;
    }
}

let _accelerometerRecordService = null;
export function getAccelerometerRecordService(): AbstractRecordMessagingService<AccelerometerSensorRecord> {
    if (!_accelerometerRecordService) {
        _accelerometerRecordService = new AccelerometerRecordMessagingService();
    }
    return _accelerometerRecordService;
}

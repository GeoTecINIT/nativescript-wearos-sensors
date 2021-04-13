import { AbstractRecordMessagingService } from "../../messaging/android/abstract-record-messaging-service.android";
import { AccelerometerSensorRecord } from "../record";
import { MessagingProtocol } from "../../messaging";
import { SensorCallbackManager } from "../../sensor-callback-manager";
import { wearOS } from "../../utils/android/wear-os-types.android";

import ByteBuffer = java.nio.ByteBuffer;

export class AccelerometerRecordMessagingService extends AbstractRecordMessagingService<AccelerometerSensorRecord> {

    decodeRecord(messageEvent: wearOS.MessageEvent): AccelerometerSensorRecord {
        const buff = ByteBuffer.wrap(messageEvent.getData());
        const x = buff.getFloat();
        const y = buff.getFloat();
        const z = buff.getFloat();
        const time = buff.getLong();

        return {
            deviceName: messageEvent.getSourceNodeId(),
            timestamp: new Date(time),
            x,
            y,
            z,
        };
    }
}

let _accelerometerRecordService = null;
export function getAccelerometerRecordService(): AbstractRecordMessagingService<AccelerometerSensorRecord> {
    if (!_accelerometerRecordService) {
        _accelerometerRecordService = new AccelerometerRecordMessagingService();
    }
    return _accelerometerRecordService;
}

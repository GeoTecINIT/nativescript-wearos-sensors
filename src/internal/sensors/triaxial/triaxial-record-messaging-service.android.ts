import { AbstractRecordMessagingService } from "../../communication/messaging/android/abstract-record-messaging-service.android";
import { wearOS } from "../../utils/android/wear-os-types.android";
import { TriAxialSensorRecord } from "./record";
import { SensorRecords } from "../sensor-record";

import ByteBuffer = java.nio.ByteBuffer;

export class TriAxialRecordMessagingService extends AbstractRecordMessagingService {

    decodeRecords(messageEvent: wearOS.MessageEvent): SensorRecords<TriAxialSensorRecord> {
        const buff = ByteBuffer.wrap(messageEvent.getData());
        const size = buff.getInt();
        let x, y, z, time;

        const records: TriAxialSensorRecord[] = [];
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

        return {
            type: null,
            records,
        };
    }
}

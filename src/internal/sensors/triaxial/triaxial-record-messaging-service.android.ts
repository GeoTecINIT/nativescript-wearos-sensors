import { AbstractRecordMessagingService } from "../../communication/messaging/android/abstract-record-messaging-service.android";
import { wearOS } from "../../utils/android/wear-os-types.android";
import { TriAxialSensorSample } from "./sample";
import { SensorRecord } from "../sensor-record";

import ByteBuffer = java.nio.ByteBuffer;
import { MessagingProtocol } from "../../communication/messaging";

export class TriAxialRecordMessagingService extends AbstractRecordMessagingService {

    constructor(protocol: MessagingProtocol) {
        super(protocol);
    }

    decodeSamples(messageEvent: wearOS.MessageEvent): SensorRecord<TriAxialSensorSample> {
        const buff = ByteBuffer.wrap(messageEvent.getData());
        const size = buff.getInt();
        let x, y, z, time;

        const samples: TriAxialSensorSample[] = [];
        for (let i = 0; i < size; i++) {
            x = buff.getFloat();
            y = buff.getFloat();
            z = buff.getFloat();
            time = buff.getLong();
            samples.push({
                timestamp: time,
                x,
                y,
                z,
            });
        }

        return {
            type: null,
            deviceId: messageEvent.getSourceNodeId(),
            samples: samples,
        };
    }
}

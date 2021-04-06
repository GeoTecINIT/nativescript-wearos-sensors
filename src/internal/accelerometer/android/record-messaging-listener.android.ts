import { AbstractRecordMessagingListener } from "../../messaging/android/abstract-record-messaging-listener";
import { AccelerometerSensorRecord } from "../record";
import { MessagingProtocol } from "../../messaging";
import { SensorCallbackManager } from "../../sensor-callback-manager";
import { OnMessageReceivedListener, wearOS } from "../../utils/android/wear-os-types.android";

import ByteBuffer = java.nio.ByteBuffer;

export class AccelerometerRecordMessagingListener extends AbstractRecordMessagingListener<AccelerometerSensorRecord> {

    constructor(
        protected protocol: MessagingProtocol,
        protected callbackManager: SensorCallbackManager<AccelerometerSensorRecord>,
    ) {
        super(protocol, callbackManager);
    }

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

let _accelerometerRecordListener = null;
export function getAccelerometerRecordListener(
    protocol: MessagingProtocol,
    callback: SensorCallbackManager<AccelerometerSensorRecord>
): OnMessageReceivedListener {
    if (!_accelerometerRecordListener) {
        _accelerometerRecordListener = new AccelerometerRecordMessagingListener(
            protocol,
            callback,
        );
    }
    return _accelerometerRecordListener;
}

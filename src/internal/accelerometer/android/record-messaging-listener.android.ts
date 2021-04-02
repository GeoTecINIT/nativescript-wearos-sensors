import { AbstractRecordMessagingListener } from "../../messaging/android/abstract-record-messaging-listener";
import { AccelerometerSensorRecord } from "../record";
import { MessagingProtocol } from "../../messaging";
import { SensorCallbackManager } from "../../sensor-callback-manager";

export class AccelerometerRecordMessagingListener extends AbstractRecordMessagingListener<AccelerometerSensorRecord> {

    constructor(
        protected protocol: MessagingProtocol,
        protected callbackManager: SensorCallbackManager<AccelerometerSensorRecord>,
    ) {
        super(protocol, callbackManager);
    }

    decodeRecord(encodedMessage: native.Array<number>): AccelerometerSensorRecord {
        return undefined;
    }
}

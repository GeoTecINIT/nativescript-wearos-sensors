import { wearOS, OnMessageReceivedListener } from "../../utils/android/wear-os-types.android";
import { MessagingProtocol } from "../index";
import { SensorRecord } from "../../sensor-record";
import { SensorCallbackManager } from "../../sensor-callback-manager";

export abstract class AbstractRecordMessagingListener<T extends SensorRecord> implements OnMessageReceivedListener {

    constructor(
        protected protocol: MessagingProtocol,
        protected callbackManager: SensorCallbackManager<T>) {
    }

    onMessageReceived(message: wearOS.MessageEvent) {
        const messagePath = message.getPath();

        if (messagePath !== this.protocol.newRecordMessagePath) {
            return;
        }

        if (message.getData() === null) {
            return;
        }

        const record = this.decodeRecord(message);
        this.callbackManager.notifyAll(record);
    }

    abstract decodeRecord(messageEvent: wearOS.MessageEvent): T;
}

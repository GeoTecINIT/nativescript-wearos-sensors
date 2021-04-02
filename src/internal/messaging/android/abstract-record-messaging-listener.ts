import OnMessageReceivedListener = com.google.android.gms.wearable.MessageClient.OnMessageReceivedListener;
import {wearOS} from "../../wear-os-types.android";
import {MessagingProtocol} from "../index";
import {SensorRecord} from "../../sensor-record";
import {SensorCallbackManager} from "../../sensor-callback-manager";

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

        const record = this.decodeRecord(message.getData());
        this.callbackManager.notifyAll(record);
    }

    abstract decodeRecord(encodedMessage: native.Array<number>): T;
}

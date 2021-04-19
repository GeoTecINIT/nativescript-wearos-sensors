import { wearOS } from "../../utils/android/wear-os-types.android";
import {MessagingProtocol} from "../index";
import { SensorRecord } from "../../sensor-record";
import { SensorCallbackManager } from "../../sensor-callback-manager";
import WearableListenerServiceDelegate = es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate;

export abstract class AbstractRecordMessagingService<T extends SensorRecord> implements WearableListenerServiceDelegate {

    private protocol: MessagingProtocol;
    private callbackManager: SensorCallbackManager<T[]>;

    public setProtocol(protocol) {
        this.protocol = protocol;
    }

    public setCallbackManager(callbackManager) {
        this.callbackManager = callbackManager;
    }

    onMessageReceived(message: wearOS.MessageEvent) {
        const messagePath = message.getPath();

        if (messagePath !== this.protocol.newRecordMessagePath) {
            return;
        }

        if (message.getData() === null) {
            return;
        }

        const records = this.decodeRecords(message);
        this.callbackManager.notifyAll(records);
    }

    abstract decodeRecords(messageEvent: wearOS.MessageEvent): T[];
}

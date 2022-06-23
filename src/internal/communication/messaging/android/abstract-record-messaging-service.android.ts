import { wearOS } from "../../../utils/android/wear-os-types.android";
import { MessagingProtocol } from "../index";
import { SensorRecord } from "../../../sensors/sensor-record";
import { SensorCallbackManager } from "../../../sensor-callback-manager";
import WearableListenerServiceDelegate = es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate;

export abstract class AbstractRecordMessagingService implements WearableListenerServiceDelegate {

    private protocol: MessagingProtocol;
    private callbackManager: SensorCallbackManager;

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

        const record = this.decodeSamples(message);
        this.callbackManager.notifyAll(record);
    }

    abstract decodeSamples(messageEvent: wearOS.MessageEvent): SensorRecord<any>;
}

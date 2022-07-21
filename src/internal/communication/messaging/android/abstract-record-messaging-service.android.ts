import { wearOS } from "../../../utils/android/wear-os-types.android";
import { MessagingProtocol } from "../index";
import { SensorRecord } from "../../../sensors/sensor-record";
import { getSensorListenerManager } from "../../../sensor-listener-manager";
import WearableListenerServiceDelegate = es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate;

export abstract class AbstractRecordMessagingService implements WearableListenerServiceDelegate {

    private protocol: MessagingProtocol;

    constructor(private listenerManager = getSensorListenerManager()) {
    }

    public setProtocol(protocol) {
        this.protocol = protocol;
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
        this.listenerManager.notify(record);
    }

    abstract decodeSamples(messageEvent: wearOS.MessageEvent): SensorRecord<any>;
}

import WearableListenerServiceDelegate = es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate;
import { wearOS } from "../../utils/android/wear-os-types.android";
import { decodeMessage } from "../encoder-decoder";
import { taskDispatcher } from "nativescript-task-dispatcher";
import { camelCase } from "../../utils/strings";

export class CommandService implements WearableListenerServiceDelegate {

    onMessageReceived(message: wearOS.MessageEvent): void {
        const path = message.getPath();

        if (path !== "command") {
            return;
        }

        if (message.getData() === null) {
            return;
        }

        const command = decodeMessage(message.getData());
        taskDispatcher.emitEvent(
            camelCase(command) + "Command",
            {
                deviceId: message.getSourceNodeId()
            }
        );
    }
}

let _instance: CommandService;
export function getCommandService(): CommandService {
    if (!_instance) {
        _instance = new CommandService();
    }
    return _instance;
}

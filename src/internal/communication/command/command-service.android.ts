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

        const parameters = this.extractCommandParameters(
            decodeMessage(message.getData())
        );
        taskDispatcher.emitEvent(
            camelCase(parameters.commandName) + "Command",
            {
                deviceId: message.getSourceNodeId(),
                config: parameters.config,
            }
        );
    }

    private extractCommandParameters(command: string) {
        const paramList = command.split("#");

        if (paramList.length === 3) {
            return {
                commandName: paramList[0],
                config: {
                    sensorType: paramList[1],
                    batchSize: paramList[2],
                }
            };
        }

        return {
            commandName: paramList[0]
        };
    }
}

let _instance: CommandService;
export function getCommandService(): CommandService {
    if (!_instance) {
        _instance = new CommandService();
    }
    return _instance;
}

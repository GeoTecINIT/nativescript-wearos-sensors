import WearableListenerServiceDelegate = es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate;
import { wearOS } from "../../utils/android/wear-os-types.android";
import { decodeMessage } from "../encoder-decoder";
import { fromString, SensorType } from "../../sensors/sensor-type";
import { getCollectorManager } from "../../collection";
import { Node } from "../../node";
import { CollectionConfiguration } from "../../collection/collection-configuration";

const ALL_SENSORS = [
    SensorType.ACCELEROMETER,
    SensorType.GYROSCOPE,
    SensorType.MAGNETOMETER,
    SensorType.HEART_RATE,
    SensorType.LOCATION,
];

export class CommandService implements WearableListenerServiceDelegate {

    async onMessageReceived(message: wearOS.MessageEvent): Promise<void> {
        const path = message.getPath();

        if (path !== "command") return;

        if (message.getData() === null) return;

        const parameters = extractCommandParameters(
            decodeMessage(message.getData())
        );

        if (!parameters) return;

        if (parameters.sensorType !== null) {
             await executeAction(
                message.getSourceNodeId(),
                parameters.action,
                parameters.sensorType,
                parameters.config
            );
        } else {
            for (const sensorType of ALL_SENSORS) {
                await executeAction(
                    message.getSourceNodeId(),
                    parameters.action,
                    sensorType,
                    parameters.config
                );
            }
        }
    }
}

enum CommandAction {
    START, STOP
}

function extractCommandParameters(command: string) {
    const paramList = command.split("#");

    if (paramList.length === 0) return undefined;

    const actionAndSensorType = extractActionAndSensorType(paramList[0]);

    return paramList.length === 3
        ? { ...actionAndSensorType,
            config: {
                sensorInterval: parseInt(paramList[1]),
                batchSize: parseInt(paramList[2]),
            }
        }
        : { ...actionAndSensorType, config: undefined};
}

function extractActionAndSensorType(command: string) {
    const actionAndSensor = command.split("-");
    const action = actionAndSensor[0] === 'start' ? CommandAction.START : CommandAction.STOP;
    const sensorType = fromString(actionAndSensor[1]);

    return {
        action: action,
        sensorType: sensorType
    };
}

async function executeAction(nodeId: string, action: CommandAction, sensorType: SensorType, config: CollectionConfiguration): Promise<void> {
    const collector = getCollectorManager(sensorType);
    const node = new Node(nodeId, "", [sensorType]);

    if (action === CommandAction.STOP) {
        await collector.stopCollecting(node);
        return;
    }

    const isReady = await collector.isReady(node);
    if (!isReady) {
        const errors = await collector.prepare(node);
        if (errors) {
            console.log(`[Command Service] - prepare error: ${JSON.stringify(errors)}`);
            return;
        }
    }

    await collector.startCollecting(node, config);
}

let _instance: CommandService;
export function getCommandService(): CommandService {
    if (!_instance) {
        _instance = new CommandService();
    }
    return _instance;
}

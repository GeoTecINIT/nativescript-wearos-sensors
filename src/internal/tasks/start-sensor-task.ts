import { Task, TaskOutcome, TaskParams } from "nativescript-task-dispatcher/tasks";
import { DispatchableEvent } from "nativescript-task-dispatcher/events";
import { SensorType } from "../sensors/sensor-type";
import { getSensorCollector } from "../sensors";
import { Node } from "../node";
import { taskDispatcher } from "nativescript-task-dispatcher";
import { camelCase } from "../utils/strings";

export class StartSensorTask extends Task {

    constructor(
        private sensorType: SensorType
    ) {
        super(`${camelCase(sensorType)}StartSensorTask`);
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void | TaskOutcome> {
        const data = invocationEvent.data;

        const collector = getSensorCollector(this.sensorType);
        const node = new Node(data.deviceId, "", [this.sensorType]);

        const isReady = await collector.isReady(node);
        if (!isReady) {
            const errors = await collector.prepare(node);
            if (errors) {
                console.log(`StartSensorTask: ${JSON.stringify(errors)}`);
                return;
            }
        }

        collector.listenSensorUpdates((records) => {
            taskDispatcher.emitEvent(
                `${camelCase(this.sensorType)}RecordsAcquired`,
                {
                    deviceId: records.records[0].deviceId,
                    records: records
                });
        });
        await collector.startCollecting(
            node,
            data.config
        );
    }

}

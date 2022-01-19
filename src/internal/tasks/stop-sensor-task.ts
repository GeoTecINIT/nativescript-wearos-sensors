import { Task, TaskOutcome, TaskParams } from "nativescript-task-dispatcher/tasks";
import { SensorType } from "../sensors/sensor-type";
import { DispatchableEvent } from "nativescript-task-dispatcher/events";
import { getSensorCollector } from "../sensors";
import { Node } from "../node";
import { camelCase } from "../utils/strings";

export class StopSensorTask extends Task {

    constructor(private sensorType: SensorType) {
        super(`${camelCase(sensorType)}StopSensorTask`);
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void | TaskOutcome> {
        const collector = getSensorCollector(this.sensorType);

        collector.stopListenSensorUpdates();
        await collector.stopCollecting(
            new Node(invocationEvent.data.deviceId, "", [this.sensorType])
        );
    }
}

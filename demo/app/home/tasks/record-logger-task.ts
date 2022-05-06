import { Task, TaskOutcome, TaskParams } from "nativescript-task-dispatcher/tasks";
import { DispatchableEvent } from "nativescript-task-dispatcher/events";
import { getLogger } from "~/home/logger/logger-view-model";

export class RecordLoggerTask extends Task {

    constructor(name: string) {
        super(name);
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void | TaskOutcome> {
        const records = invocationEvent.data.records;
        const deviceId = records.records[0].deviceId;
        getLogger().logResultForNode(deviceId, JSON.stringify(records));
    }
}

import { Task, TaskOutcome, TaskParams } from "nativescript-task-dispatcher/tasks";
import { DispatchableEvent } from "nativescript-task-dispatcher/internal/events";
import { getLogger } from "~/home/logger/logger-view-model";

export class CommandLoggerTask extends Task {

    constructor(name: string) {
        super(name);
    }

    protected onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void | TaskOutcome> {
        getLogger().logInfo(`${invocationEvent.name} received for ${invocationEvent.data.deviceId}.`);
        return;
    }
}

import { Task, TaskOutcome, TaskParams } from "nativescript-task-dispatcher/tasks";
import { DispatchableEvent } from "nativescript-task-dispatcher/internal/events";
import { getStore } from "~/home/store/store";

export class AccumulatorTask extends Task {

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void | TaskOutcome> {
        const records = invocationEvent.data.records;

        getStore().addRecord(records);
    }
}

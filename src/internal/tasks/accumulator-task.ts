import { Task, TaskOutcome, TaskParams } from "nativescript-task-dispatcher/tasks";
import { DispatchableEvent } from "nativescript-task-dispatcher/internal/events";
import { getStore } from "../store/store";

export class AccumulatorTask extends Task {

    constructor(
        private store = getStore()
    ) {
        super("accumulatorTask");
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void | TaskOutcome> {
        const records = invocationEvent.data.records;
        this.store.addRecord(records);
    }
}

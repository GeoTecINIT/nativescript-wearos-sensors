import { Task, TaskOutcome, TaskParams } from "nativescript-task-dispatcher/tasks";
import { DispatchableEvent } from "nativescript-task-dispatcher/internal/events";
import { getStore } from "../store/store";

export class ClearCollectedDataTask extends Task {

    constructor(
        private store = getStore()
    ) {
        super("clearCollectedDataTask");
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void | TaskOutcome> {
        this.store.clear();
    }
}

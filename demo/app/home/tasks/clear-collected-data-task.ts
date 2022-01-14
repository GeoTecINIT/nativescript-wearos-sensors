import { Task, TaskOutcome, TaskParams } from "nativescript-task-dispatcher/tasks";
import { DispatchableEvent } from "nativescript-task-dispatcher/internal/events";
import { getStore } from "~/home/store/store";
import { getLogger } from "~/home/logger/logger-view-model";

export class ClearCollectedDataTask extends Task {

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void | TaskOutcome> {
        getStore().clear();
        getLogger().logInfo("data collected cleared");
    }
}

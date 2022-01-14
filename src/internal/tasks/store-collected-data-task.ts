import { Task, TaskOutcome, TaskParams } from "nativescript-task-dispatcher/tasks";
import { DispatchableEvent } from "nativescript-task-dispatcher/internal/events";
import { getStore } from "../store/store";

export class StoreCollectedDataTask extends Task {

    constructor(
        private store = getStore()
    ) {
        super("storeCollectedDataTask");
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void | TaskOutcome> {
        const nodeId = invocationEvent.data.deviceId;
        const fileName = `${nodeId}_${Date.now()}.json`;

        await this.store.store(fileName);
    }
}

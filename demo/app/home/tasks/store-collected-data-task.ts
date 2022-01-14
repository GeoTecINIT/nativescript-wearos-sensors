import { Task, TaskOutcome, TaskParams } from "nativescript-task-dispatcher/tasks";
import { DispatchableEvent } from "nativescript-task-dispatcher/internal/events";
import { getStore } from "~/home/store/store";
import { getLogger } from "~/home/logger/logger-view-model";

export class StoreCollectedDataTask extends Task {

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void | TaskOutcome> {
        const nodeId = invocationEvent.data.deviceId
        const fileName = `${nodeId}_${Date.now()}.json`;

        setTimeout(async () => {
            try {
                await getStore().store(fileName);
                getLogger().logInfo(`data stored at ${fileName}`);
            } catch (e) {
                getLogger().logInfo("there was no data to store");
            }
        }, 2000);
    }
}

import { Task, TaskOutcome, TaskParams } from "nativescript-task-dispatcher/tasks";
import { DispatchableEvent } from "nativescript-task-dispatcher/internal/events";
import { getLogger } from "~/home/logger/logger-view-model";

export class MessageLoggerTask extends Task {

    constructor(
        name: string,
        private message: string,
        private logger = getLogger()
    ) {
        super(name);
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void | TaskOutcome> {
        this.logger.logInfo(this.message);
    }

}

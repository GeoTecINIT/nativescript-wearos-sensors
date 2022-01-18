import { Task, TaskOutcome, TaskParams } from "nativescript-task-dispatcher/tasks";
import { DispatchableEvent } from "nativescript-task-dispatcher/internal/events";
import { ResultClient } from "../communication/result/result-client";
import { Node } from "../node";

export class SendResultTask extends Task {

    constructor() {
        super("sendResultTask");
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void | TaskOutcome> {
        const { nodeId, result } = invocationEvent.data;
        const resultClient = new ResultClient();
        await resultClient.sendResult(
            new Node(nodeId, "", []),
            result
        );
    }
}

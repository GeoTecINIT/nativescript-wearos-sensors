import { Task, TaskOutcome, TaskParams } from "nativescript-task-dispatcher/tasks";
import { DispatchableEvent } from "nativescript-task-dispatcher/internal/events";
import { SingleMessageClient } from "../communication/single-message/single-message-client.android";
import { Node } from "../node";

export class SendSingleMessageTask extends Task {

    constructor() {
        super("sendSingleMessageTask");
    }

    protected async onRun(
        taskParams: TaskParams,
        invocationEvent: DispatchableEvent
    ): Promise<void | TaskOutcome> {
        const { nodeId, result, messagePath } = invocationEvent.data;
        const resultClient = new SingleMessageClient(messagePath);
        await resultClient.sendResult(
            new Node(nodeId, "", []),
            result
        );
    }
}

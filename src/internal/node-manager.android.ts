import { Node } from "./utils/android/wear-os-types.android";
import { MessagingClient } from "./messaging/messaging-client";
import { ResolutionResult } from "./messaging/android/result-messaging-service.android";

export class NodeManager {
    constructor(
        private node: Node,
        private messagingClient: MessagingClient
    ) {}

    getNode(): Node {
        return this.node;
    }

    getNodeId(): string {
        return this.node.getId();
    }

    async isReady(): Promise<ResolutionResult> {
        return await this.messagingClient.sendIsReadyMessageAndWaitForResolution(this.node);
    }

    async prepare(): Promise<ResolutionResult> {
        return await this.messagingClient.sendPrepareMessageAndWaitForResolution(this.node);
    }

    async startCollecting(): Promise<void> {
        await this.messagingClient.sendStartMessage(this.node);
    }

    async stopCollecting(): Promise<void> {
        await this.messagingClient.sendStopMessage(this.node);
    }
}



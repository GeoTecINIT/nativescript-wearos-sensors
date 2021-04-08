import { wearOS} from "./utils/android/wear-os-types.android";
import { MessagingProtocol, ResultMessagingProtocol } from "./messaging";
import { ResolutionResult, ResultMessagingListener } from "./messaging/android/result-messaging-listener.android";
import { MessagingClient } from "./messaging/messaging-client";

export class NodeManager {
    constructor(
        private node: wearOS.Node,
        private protocol: MessagingProtocol,
        private messagingClient: MessagingClient
    ) {}

    getNodeId(): string {
        return this.node.getId();
    }

    async isReady(): Promise<ResolutionResult> {
        const resolutionPromise = this.createResolutionPromise(
            this.protocol.readyProtocol
        );
        await this.messagingClient.sendIsReadyMessage(this.node);
        return await resolutionPromise;
    }

    async prepare(): Promise<void> {
        const resolutionPromise = this.createResolutionPromise(this.protocol.prepareProtocol);
        await this.messagingClient.sendPrepareMessage(this.node);
        const resolutionResult = await resolutionPromise;
        if (!resolutionResult.success) {
            throw new Error(
                `Node ${this.node.getId()}(${this.node.getDisplayName()}): could not prepare sensor. Reason: ${resolutionResult.message}`
            );
        }
    }

    async startCollecting(): Promise<void> {
        await this.messagingClient.sendStartMessage(this.node);
    }

    async stopCollecting(): Promise<void> {
        await this.messagingClient.sendStopMessage(this.node);
    }

    private createResolutionPromise(protocol: ResultMessagingProtocol): Promise<ResolutionResult> {
        return new Promise(async (resolve) => {
            await this.messagingClient.registerMessageListener(
                new ResultMessagingListener(
                    protocol,
                    (resolutionResult) => resolve(resolutionResult),
                )
            );
        });
    }
}



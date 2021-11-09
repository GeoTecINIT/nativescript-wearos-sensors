import { MessagingClient } from "../messaging-client";
import { MessagingProtocol } from "../index";
import { MessagingResult, MessagingResultService } from "./messaging-result-service.android";
import { CommunicationClient } from "../../communication-client.android";
import { Node } from "../../../node";

export class MessagingClientImpl extends CommunicationClient<MessagingResult> implements MessagingClient {

    constructor(
        private protocol: MessagingProtocol,
        private messagingResultService: MessagingResultService,
    ) {
        super(messagingResultService);
    }

    public async sendIsReadyMessage(node: Node): Promise<MessagingResult> {
        const resolutionPromise = this.createResolutionPromise(
            this.protocol.readyProtocol,
            node
        );
        await this.sendMessage(node, this.protocol.readyProtocol.messagePath);
        return await resolutionPromise;
    }

    public async sendPrepareMessage(node: Node): Promise<MessagingResult> {
        const resolutionPromise = this.createResolutionPromise(
            this.protocol.prepareProtocol,
            node,
            false
        );
        await this.sendMessage(node, this.protocol.prepareProtocol.messagePath);
        return await resolutionPromise;
    }

    public async sendStartMessage(node: Node, message?: string) {
        await this.sendMessage(node, this.protocol.startMessagePath, message);
    }

    public async sendStopMessage(node: Node, message?: string) {
        await this.sendMessage(node, this.protocol.stopMessagePath, message);
    }
}

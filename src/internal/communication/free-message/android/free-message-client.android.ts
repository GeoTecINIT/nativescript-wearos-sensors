import { CommunicationClient } from "../../communication-client.android";
import { freeMessageProtocol, FreeMessage, ReceivedMessage } from "../index";
import { Node } from "../../../node";
import { getFreeMessageResultService } from "./free-message-result-service.android";
import { encodeFreeMessage } from "../encoder-decoder";

export class FreeMessageClient extends CommunicationClient<ReceivedMessage> {

    constructor(
        private protocol = freeMessageProtocol,
        private freeMessageResultService = getFreeMessageResultService()
    ) {
        super(freeMessageResultService);
        freeMessageResultService.setProtocol(protocol);
    }

    public async send(node: Node, freeMessage: FreeMessage): Promise<void> {
        const message = encodeFreeMessage(freeMessage);
        await this.sendMessage(node, this.protocol.withoutResponse, message);
    }

    public async sendExpectingResponse(node: Node, freeMessage: FreeMessage, timeout: number = 5000): Promise<ReceivedMessage> {
        const resolutionPromise = this.createResolutionPromise(
            this.protocol,
            node,
            timeout
        );

        const message = encodeFreeMessage(freeMessage);
        await this.sendMessage(node, this.protocol.expectingResponse, message);
        return await resolutionPromise;
    }
}
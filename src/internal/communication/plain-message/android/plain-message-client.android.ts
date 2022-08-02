import { CommunicationClient } from "../../communication-client.android";
import {
    plainMessageProtocol,
    PlainMessage,
    ReceivedMessage,
    PlainMessageListener,
    arePlainMessagesEnabled
} from "../index";
import { PlainMessageClient } from "../plain-message-client";
import { Node } from "../../../node";
import { getPlainMessageResultService } from "./plain-message-result-service.android";
import { encodePlainMessage } from "../encoder-decoder";

export class PlainMessageAndroidClient extends CommunicationClient<ReceivedMessage> implements PlainMessageClient {

    constructor(
        private protocol = plainMessageProtocol,
        private plainMessageResultService = getPlainMessageResultService(),
        private plainMessagesEnabled = arePlainMessagesEnabled()
    ) {
        super(plainMessageResultService);
        plainMessageResultService.setProtocol(protocol);
    }

    public enabled(): boolean {
        return this.plainMessagesEnabled;
    }

    public registerListener(listener: PlainMessageListener): void {
        this.plainMessageResultService.setDefaultListener(listener);
    }

    public unregisterListener(): void {
        this.plainMessageResultService.clearDefaultListener();
    }

    public async send(node: Node, plainMessage: PlainMessage): Promise<void> {
        if (!this.enabled()) return;

        const message = encodePlainMessage(plainMessage);
        await this.sendMessage(node, this.protocol.withoutResponse, message);
    }

    public async sendExpectingResponse(node: Node, plainMessage: PlainMessage, timeout: number = 5000): Promise<ReceivedMessage> {
        if (!this.enabled()) return undefined;

        const resolutionPromise = this.createResolutionPromise(
            this.protocol,
            node,
            timeout
        );

        const message = encodePlainMessage(plainMessage);
        await this.sendMessage(node, this.protocol.expectingResponse, message);
        return await resolutionPromise;
    }
}

let _instance: PlainMessageClient;
export function getPlainMessageAndroidClient(): PlainMessageClient {
    if (!_instance) {
        _instance = new PlainMessageAndroidClient();
    }
    return _instance;
}
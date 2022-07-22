import { CommunicationClient } from "../../communication-client.android";
import {
    freeMessageProtocol,
    FreeMessage,
    ReceivedMessage,
    FreeMessageListener,
    areFreeMessagesEnabled
} from "../index";
import { FreeMessageClient } from "../free-message-client";
import { Node } from "../../../node";
import { getFreeMessageResultService } from "./free-message-result-service.android";
import { encodeFreeMessage } from "../encoder-decoder";

export class FreeMessageAndroidClient extends CommunicationClient<ReceivedMessage> implements FreeMessageClient {

    constructor(
        private protocol = freeMessageProtocol,
        private freeMessageResultService = getFreeMessageResultService(),
        private freeMessagesEnabled = areFreeMessagesEnabled()
    ) {
        super(freeMessageResultService);
        freeMessageResultService.setProtocol(protocol);
    }

    public enabled(): boolean {
        return this.freeMessagesEnabled;
    }

    public registerListener(listener: FreeMessageListener): void {
        this.freeMessageResultService.setDefaultListener(listener);
    }

    public unregisterListener(): void {
        this.freeMessageResultService.clearDefaultListener();
    }

    public async send(node: Node, freeMessage: FreeMessage): Promise<void> {
        if (!this.enabled()) return;

        const message = encodeFreeMessage(freeMessage);
        await this.sendMessage(node, this.protocol.withoutResponse, message);
    }

    public async sendExpectingResponse(node: Node, freeMessage: FreeMessage, timeout: number = 5000): Promise<ReceivedMessage> {
        if (!this.enabled()) return undefined;

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

let _instance: FreeMessageClient;
export function getFreeMessageAndroidClient(): FreeMessageClient {
    if (!_instance) {
        _instance = new FreeMessageAndroidClient();
    }
    return _instance;
}
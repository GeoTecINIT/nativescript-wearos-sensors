import { android as androidApp } from "tns-core-modules/application/application";
import {
    WearMessageClient,
    OnMessageReceivedListener,
    wearOS,
    NodeSet,
    Node } from "../../utils/android/wear-os-types.android";
import { promisify } from "../../utils/android/utils.android";
import { MessagingClient } from "../messaging-client";
import { MessagingProtocol } from "../index";


export class MessagingClientImpl implements MessagingClient {

    private messageClient: WearMessageClient;

    constructor(
        private protocol: MessagingProtocol,
    ) {
        this.messageClient = wearOS.Wearable.getMessageClient(androidApp.context);
    }

    public async sendIsReadyMessage(node: Node) {
        await this.sendMessage(node, this.protocol.readyProtocol.messagePath);
    }

    public async sendPrepareMessage(node: Node) {
        await this.sendMessage(node, this.protocol.prepareProtocol.messagePath);
    }

    public async sendStartMessage(node: Node, message?: string) {
        await this.sendMessage(node, this.protocol.startMessagePath, message);
    }

    public async sendStopMessage(node: Node, message?: string) {
        await this.sendMessage(node, this.protocol.stopMessagePath, message);
    }

    public async registerMessageListener(listener: OnMessageReceivedListener) {
        await promisify(
            this.messageClient.addListener(listener)
        );
    }

    public async removeMessageListener(listener: OnMessageReceivedListener) {
        await promisify(
            this.messageClient.removeListener(listener)
        );
    }

    private async sendMessage(node: Node, path: string, message?: string): Promise<void> {
        const messageArray = message ?
            Array.from(message).map((x) => x.charCodeAt(0)) :
            null;

        await promisify(
            this.messageClient.sendMessage(node.getId(), path, messageArray)
        );
    }
}

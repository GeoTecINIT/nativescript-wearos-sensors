import { android as androidApp } from "tns-core-modules/application/application";
import {
    WearMessageClient,
    OnMessageReceivedListener,
    wearOS,
    NodeSet,
    Node } from "../../wear-os-types.android";
import { promisify } from "../../utils.android";
import { MessagingClient } from "../messaging-client";
import { MessagingProtocol } from "../index";


export class MessagingClientImpl implements MessagingClient {

    private messageClient: WearMessageClient;

    constructor(
        private protocol: MessagingProtocol,
    ) {
        this.messageClient = wearOS.Wearable.getMessageClient(androidApp.context);
    }

    public async sendIsReadyMessage(nodes: NodeSet) {
        await this.sendMessageToConnectedNodes(nodes, this.protocol.readyProtocol.messagePath);
    }

    public async sendPrepareMessage(nodes: NodeSet) {
        await this.sendMessageToConnectedNodes(nodes, this.protocol.prepareProtocol.messagePath);
    }

    public async sendStartMessage(nodes: NodeSet, message?: string) {
        await this.sendMessageToConnectedNodes(nodes, this.protocol.startMessagePath, message);
    }

    public async sendStopMessage(nodes: NodeSet, message?: string) {
        await this.sendMessageToConnectedNodes(nodes, this.protocol.stopMessagePath, message);
    }

    private async sendMessageToConnectedNodes(nodes: NodeSet, path: string, message?: string) {
        const iterator = nodes.iterator();
        while (iterator.hasNext()) {
            const node = iterator.next();
            await this.sendMessage(node, path, message);
        }
    }

    private async sendMessage(node: Node, path: string, message?: string): Promise<void> {
        const messageArray = message ?
            Array.from(message).map((x) => x.charCodeAt(0)) :
            null;

        await promisify(
            this.messageClient.sendMessage(node.getId(), path, messageArray)
        );
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
}

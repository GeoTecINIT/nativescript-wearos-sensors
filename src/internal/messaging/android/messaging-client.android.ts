import { android as androidApp } from "tns-core-modules/application/application";
import {
    WearMessageClient,
    wearOS,
    Node } from "../../utils/android/wear-os-types.android";
import { promisify } from "../../utils/android/utils.android";
import { encodeMessage, MessagingClient } from "../messaging-client";
import { MessagingProtocol, ResultMessagingProtocol } from "../index";
import { ResolutionResult, ResultMessagingService} from "./result-messaging-service.android";


export class MessagingClientImpl implements MessagingClient {

    private messageClient: WearMessageClient;

    constructor(
        private protocol: MessagingProtocol,
        private resultMessagingService: ResultMessagingService,
    ) {
        this.messageClient = wearOS.Wearable.getMessageClient(androidApp.context);
    }

    public async sendIsReadyMessageAndWaitForResolution(node: Node): Promise<ResolutionResult> {
        const resolutionPromise = this.createResolutionPromise(
            this.protocol.readyProtocol
        );
        await this.sendMessage(node, this.protocol.readyProtocol.messagePath);
        return await resolutionPromise;
    }

    public async sendPrepareMessageAndWaitForResolution(node: Node): Promise<ResolutionResult> {
        const resolutionPromise = this.createResolutionPromise(
            this.protocol.prepareProtocol
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

    private createResolutionPromise(protocol: ResultMessagingProtocol): Promise<ResolutionResult> {
        this.resultMessagingService.setProtocol(protocol);
        return new Promise(async (resolve) => {
            this.resultMessagingService.setResolutionCallback(
                (resolutionResult) => resolve(resolutionResult),
            );
        });
    }

    private async sendMessage(node: Node, path: string, message?: string): Promise<void> {
        const messageArray = message ?
            encodeMessage(message) :
            null;
        console.log(`Going to send message: ${node.getId()}, ${path}, ${messageArray}`);

        await promisify(
            this.messageClient.sendMessage(node.getId(), path, messageArray)
        );
    }
}

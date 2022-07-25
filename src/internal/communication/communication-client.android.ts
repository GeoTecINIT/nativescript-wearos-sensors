import { Utils } from "@nativescript/core";
import { WearMessageClient, wearOS } from "../utils/android/wear-os-types.android";
import { Node } from "../node";
import { encodeMessage } from "./encoder-decoder";
import { promisify } from "../utils/android/utils.android";
import { CommunicationResultService } from "./communication-result-service";
import { CommunicationProtocol } from "./communication-protocol";
import { ResultMessagingProtocol } from "./messaging";

export class CommunicationClient<T> {

    private messageClient: WearMessageClient;

    protected constructor(
        private communicationResultService: CommunicationResultService,
    ) {
        this.messageClient = wearOS.Wearable.getMessageClient(Utils.android.getApplicationContext());
    }

    protected async sendMessage(node: Node, path: string, message?: string): Promise<void> {
        const messageArray = message ?
            encodeMessage(message) :
            null;

        await promisify(
            this.messageClient.sendMessage(node.id, path, messageArray)
        );
    }

    protected async sendMessageAndWaitForResolution(node: Node, protocol: ResultMessagingProtocol, timeout?: number) {
        const resolutionPromise = this.createResolutionPromise(
            protocol,
            node,
            timeout
        );
        await this.sendMessage(node, protocol.messagePath);
        return await resolutionPromise;
    }

    protected createResolutionPromise(protocol: CommunicationProtocol, node: Node, timeout?: number): Promise<T> {
        this.communicationResultService.setProtocol(protocol);
        return new Promise<T>(async (resolve, reject) => {
            let timeoutId;
            if (timeout) {
                timeoutId = setTimeout(() => {
                    reject(`Timeout for communication request in node ${node.name} (${node.id})`);
                }, timeout);
            }

            this.communicationResultService.setResolutionCallbackForNode(
                node.id,
                (resolution) => {
                    if (timeout)
                        clearTimeout(timeoutId);
                    resolve(resolution);
                },
            );
        });
    }
}

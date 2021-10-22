import { Application } from "@nativescript/core";
import { WearMessageClient, wearOS } from "../utils/android/wear-os-types.android";
import { Node } from "../node";
import { encodeMessage } from "./encoder-decoder";
import { promisify } from "../utils/android/utils.android";
import { CommunicationResultService } from "./communication-result-service";
import { CommunicationProtocol } from "./communication-protocol";

export class CommunicationClient<T> {

    private messageClient: WearMessageClient;

    protected constructor(
        private communicationResultService: CommunicationResultService,
    ) {
        this.messageClient = wearOS.Wearable.getMessageClient(Application.android.context);
    }

    protected async sendMessage(node: Node, path: string, message?: string): Promise<void> {
        const messageArray = message ?
            encodeMessage(message) :
            null;
        console.log(`Going to send message: ${node.id}, ${path}, ${messageArray}`);

        await promisify(
            this.messageClient.sendMessage(node.id, path, messageArray)
        );
    }

    protected createResolutionPromise(protocol: CommunicationProtocol): Promise<T> {
        this.communicationResultService.setProtocol(protocol);
        return new Promise<T>(async (resolve) => {
            this.communicationResultService.setResolutionCallback(
                (resolution) => resolve(resolution),
            );
        });
    }
}

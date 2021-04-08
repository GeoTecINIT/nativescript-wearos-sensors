import { OnMessageReceivedListener, wearOS } from "../../utils/android/wear-os-types.android";
import { ResultMessagingProtocol } from "../index";
import { decodeMessage } from "../messaging-client";

export class ResultMessagingListener implements OnMessageReceivedListener {

    constructor(
        private protocol: ResultMessagingProtocol,
        private resolutionCallback: (resolution: ResolutionResult) => void,
    ) {}

    onMessageReceived(message: wearOS.MessageEvent): void {
        const messagePath = message.getPath();

        if (messagePath !== this.protocol.messagePath) {
            return;
        }

        const decodedMessage = decodeMessage(message.getData());
        const messageParts = decodedMessage.split('#');
        if (messageParts[0] === this.protocol.successResponse) {
            this.resolutionCallback({
                nodeId: message.getSourceNodeId(),
                success: true,
            });
        } else if (messageParts[0] === this.protocol.failureResponse) {
            const partialResolution = { nodeId: message.getSourceNodeId(), success: false };
            const resolution = messageParts.length > 1 ?
                { ...partialResolution, message: messageParts[1]} :
                partialResolution;
            this.resolutionCallback(resolution);
        }
    }
}

export interface ResolutionResult {
    nodeId: string;
    success: boolean;
    message?: string;
}

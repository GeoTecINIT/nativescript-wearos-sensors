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
            this.resolutionCallback({
                nodeId: message.getSourceNodeId(),
                success: false,
                message: messageParts.length > 1 ? messageParts[1] : undefined,
            });
        }
    }
}

export interface ResolutionResult {
    nodeId: string;
    success: boolean;
    message?: string;
}

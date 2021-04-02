import { OnMessageReceivedListener, wearOS } from "../../wear-os-types.android";
import { ResultMessagingProtocol } from "../index";
import { decodeMessage } from "../messaging-client";

export class ResultMessagingListener implements OnMessageReceivedListener {

    constructor(
        private protocol: ResultMessagingProtocol,
        private success: () => void,
        private failure: () => void,
    ) {}

    onMessageReceived(message: wearOS.MessageEvent): void {
        const messagePath = message.getPath();

        if (messagePath !== this.protocol.messagePath) {
            return;
        }

        const readyResult = decodeMessage(message.getData());
        if (readyResult === this.protocol.successResponse) {
            this.success();
        } else if (readyResult === this.protocol.failureResponse) {
            this.failure();
        }
    }
}

import { MessagingResult } from "./android/messaging-result-service.android";
import { Node } from "../../node/node.android";

export interface MessagingClient {
    sendIsReadyMessage(node: Node): Promise<MessagingResult>;
    sendPrepareMessage(node: Node): Promise<MessagingResult>;
    sendStartMessage(node: Node, message?: string);
    sendStopMessage(node: Node, message?: string);
}

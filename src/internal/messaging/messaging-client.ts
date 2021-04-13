import { Node } from "../utils/android/wear-os-types.android";
import { ResolutionResult } from "./android/result-messaging-service.android";

export interface MessagingClient {
    sendIsReadyMessageAndWaitForResolution(node: Node): Promise<ResolutionResult>;
    sendPrepareMessageAndWaitForResolution(node: Node): Promise<ResolutionResult>;
    sendStartMessage(node: Node, message?: string);
    sendStopMessage(node: Node, message?: string);
}

export function encodeMessage(message: string): number[] {
    return Array.from(message).map((x) => x.charCodeAt(0));
}

export function decodeMessage(encodedMessage: native.Array<number>): string {
    let message = "";
    for (let i = 0; i < encodedMessage.length; i++) {
        message += String.fromCharCode(encodedMessage[i]);
    }

    return message;
}

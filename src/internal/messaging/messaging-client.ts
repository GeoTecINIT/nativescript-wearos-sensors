import { Node, OnMessageReceivedListener } from "../utils/android/wear-os-types.android";

export interface MessagingClient {
    sendIsReadyMessage(node: Node);
    sendPrepareMessage(node: Node);
    sendStartMessage(node: Node, message?: string);
    sendStopMessage(node: Node, message?: string);
    registerMessageListener(listener: OnMessageReceivedListener);
    removeMessageListener(listener: OnMessageReceivedListener);
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

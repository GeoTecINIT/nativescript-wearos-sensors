import { PlainMessageClient } from "./plain-message-client";
import { Application } from "@nativescript/core";
import { getPlainMessageAndroidClient } from "./android/plain-message-client.android";

export function getPlainMessageClient(): PlainMessageClient {
    if (Application.android) {
        return getPlainMessageAndroidClient();
    } else {
        return null;
    }
}

export interface PlainMessageProtocol {
    withoutResponse: string;
    expectingResponse: string;
}

export const plainMessageProtocol: PlainMessageProtocol = {
    withoutResponse: "plain-message-no-response",
    expectingResponse: "plain-message-expecting-response"
};

export interface PlainMessage {
    message: string;
    inResponseTo?: PlainMessage;
}

export interface ReceivedMessage {
    senderNodeId: string;
    plainMessage: PlainMessage;
}

export type PlainMessageListener = (receivedMessage: ReceivedMessage) => void;

let _plainMessagesEnabled: boolean;
export function setPlainMessagesEnabled(enabled: boolean): void {
    _plainMessagesEnabled = enabled;
}

export function arePlainMessagesEnabled(): boolean {
    return _plainMessagesEnabled;
}
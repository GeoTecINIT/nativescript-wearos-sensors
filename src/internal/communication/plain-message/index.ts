import { PlainMessageClient } from "./plain-message-client";
import { Application } from "@nativescript/core";
import { getPlainMessageAndroidClient } from "./android/plain-message-client.android";
import { flush, getBoolean, setBoolean } from "@nativescript/core/application-settings";

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

const PLAIN_MESSAGES_ENABLED = "PLAIN_MESSAGES_ENABLED_KEY";
let _plainMessagesEnabled: boolean;
export function setPlainMessagesEnabled(enabled: boolean): void {
    _plainMessagesEnabled = enabled;
    setBoolean(PLAIN_MESSAGES_ENABLED, enabled);
    flush();
}

export function arePlainMessagesEnabled(): boolean {
    if (_plainMessagesEnabled === undefined) {
        _plainMessagesEnabled = getBoolean(PLAIN_MESSAGES_ENABLED);
    }
    return _plainMessagesEnabled;
}
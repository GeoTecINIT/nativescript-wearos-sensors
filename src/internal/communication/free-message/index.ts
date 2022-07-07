import { FreeMessageClient } from "./free-message-client";
import { Application } from "@nativescript/core";
import { getFreeMessageAndroidClient } from "./android/free-message-client.android";

export function getFreeMessageClient(): FreeMessageClient {
    if (Application.android) {
        return getFreeMessageAndroidClient();
    } else {
        return null;
    }
}

export interface FreeMessageProtocol {
    withoutResponse: string;
    expectingResponse: string;
}

export const freeMessageProtocol: FreeMessageProtocol = {
    withoutResponse: "free-message-no-response",
    expectingResponse: "free-message-expecting-response"
};

export interface FreeMessage {
    message: string;
    inResponseTo?: FreeMessage;
}

export interface ReceivedMessage {
    senderNodeId: string;
    freeMessage: FreeMessage;
}

export type FreeMessageListener = (receivedMessage: ReceivedMessage) => void;
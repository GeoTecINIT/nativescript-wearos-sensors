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
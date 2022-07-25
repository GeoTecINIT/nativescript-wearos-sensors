import { FreeMessage, FreeMessageListener, ReceivedMessage } from "./index";
import { Node } from "../../node";

export interface FreeMessageClient {
    enabled(): boolean;
    registerListener(listener: FreeMessageListener): void;
    unregisterListener(): void;
    send(node: Node, freeMessage: FreeMessage): Promise<void>;
    sendExpectingResponse(node: Node, freeMessage: FreeMessage, timeout?: number): Promise<ReceivedMessage>;
}
import { PlainMessage, PlainMessageListener, ReceivedMessage } from "./index";
import { Node } from "../../node";

export interface PlainMessageClient {
    enabled(): boolean;
    registerListener(listener: PlainMessageListener): void;
    unregisterListener(): void;
    send(node: Node, plainMessage: PlainMessage): Promise<void>;
    sendExpectingResponse(node: Node, plainMessage: PlainMessage, timeout?: number): Promise<ReceivedMessage>;
}
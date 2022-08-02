import { PlainMessage } from "./index";

// TODO: Might be to heavy (?)
export function encodePlainMessage(plainMessage: PlainMessage): string {
    return JSON.stringify(plainMessage);
}

export function decodePlainMessage(message: string): PlainMessage {
    return JSON.parse(message);
}
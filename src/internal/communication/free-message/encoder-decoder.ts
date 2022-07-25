import { FreeMessage } from "./index";

// TODO: Might be to heavy (?)
export function encodeFreeMessage(freeMessage: FreeMessage): string {
    return JSON.stringify(freeMessage);
}

export function decodeFreeMessage(message: string): FreeMessage {
    return JSON.parse(message);
}
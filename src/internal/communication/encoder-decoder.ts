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

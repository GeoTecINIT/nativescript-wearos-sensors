import { decodeMessage, encodeMessage } from "nativescript-wearos-sensors/internal/communication/encoder-decoder";

describe("Messaging client utilily functions", () => {
    it("allow to get the byte encoding from a simple message string", () => {
        const message = "Hello World!";
        const byteEncoding = [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33];

        const encodedMessage = encodeMessage(message);
        expect(encodedMessage).toEqual(byteEncoding);
    })

    it("allow to get the byte encoding from a complex message string", () => {
        const message = "Hello World!#Hola Mundo!";
        const byteEncoding = [
            72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33,
            35, 72, 111, 108, 97, 32, 77, 117, 110, 100, 111, 33
        ];

        const encodedMessage = encodeMessage(message);
        expect(encodedMessage).toEqual(byteEncoding);
    })

    it("allow to get a message string from byte encoding", () => {
        const byteEncoding = [
            72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33,
            35, 72, 111, 108, 97, 32, 77, 117, 110, 100, 111, 33
        ];
        const message = "Hello World!#Hola Mundo!";

        const decodedMessage = decodeMessage(byteEncoding);
        expect(decodedMessage).toEqual(message);
    })
})

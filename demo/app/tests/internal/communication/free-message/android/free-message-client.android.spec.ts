import { FreeMessageClient } from "nativescript-wearos-sensors/internal/communication/free-message/free-message-client";
import {
    FreeMessageAndroidClient
} from "nativescript-wearos-sensors/internal/communication/free-message/android/free-message-client.android";
import {
    FreeMessage,
    FreeMessageProtocol,
    ReceivedMessage
} from "nativescript-wearos-sensors/internal/communication/free-message";
import {
    FreeMessageResultService
} from "nativescript-wearos-sensors/internal/communication/free-message/android/free-message-result-service.android";
import { Node } from "nativescript-wearos-sensors/internal/node";
import { buildFakeMessageEvent } from "~/tests/internal/index.spec";

describe("Free message client", () => {

    const node: Node = new Node("test", "test");
    const protocol: FreeMessageProtocol = {
        withoutResponse: "test-no-response",
        expectingResponse: "test-expecting-response",
    };

    let freeMessageClient: FreeMessageClient;
    let freeMessageResultService: FreeMessageResultService;

    beforeEach(() => {
        freeMessageResultService = new FreeMessageResultService();
        spyOn(freeMessageResultService, "onMessageReceived").and.callThrough();
        freeMessageClient = new FreeMessageAndroidClient(
            protocol,
            freeMessageResultService
        );
        spyOn<any>(freeMessageClient, "sendMessage").and.callFake(() => Promise.resolve());
    });

    it("sends a message to a node", async () => {
        const freeMessage: FreeMessage = {
            message: "test message"
        };

        await expectAsync(freeMessageClient.send(node, freeMessage)).toBeResolved();
    });

    it("sends a message expecting a response an a response is received", async () => {
        const freeMessage: FreeMessage = {
            message: "test message"
        };
        const freeResponse: FreeMessage = {
            message: "test response",
            inResponseTo: freeMessage
        }

        const receivedMessagePromise = freeMessageClient.sendExpectingResponse(node, freeMessage);

        freeMessageResultService.onMessageReceived(
            buildFakeMessageEvent(
                node.id,
                protocol.withoutResponse,
                JSON.stringify(freeResponse)
            )
        );

        const receivedMessage: ReceivedMessage = await receivedMessagePromise;

        expect(receivedMessage).toEqual({
            senderNodeId: node.id,
            freeMessage: freeResponse
        });
    });

    it("sends a message expecting a response but no response is received", async () => {
        const freeMessage: FreeMessage = {
            message: "test message"
        };

        await expectAsync(freeMessageClient.sendExpectingResponse(node, freeMessage, 100))
            .toBeRejectedWith(`Timeout for communication request in node ${node.name} (${node.id})`);
    });

    it("receives a wearable-triggered message", async () => {
        const freeMessageReceived: FreeMessage = {
            message: "message received from watch"
        };

        freeMessageClient.registerListener((receivedMessage) => {
            expect(receivedMessage).toEqual({
                senderNodeId: node.id,
                freeMessage: freeMessageReceived
            })
        });

        freeMessageResultService.onMessageReceived(
            buildFakeMessageEvent(
                node.id,
                protocol.withoutResponse,
                JSON.stringify(freeMessageReceived)
            )
        );

        await new Promise((resolve) => {
            setTimeout(resolve, 200)
        });
    });

    it("receives a wearable-triggered message but there is no listener attached", () => {
        const freeMessageReceived: FreeMessage = {
            message: "message received from watch"
        };
        const receivedMessage: ReceivedMessage = {
            senderNodeId: node.id,
            freeMessage: freeMessageReceived,
        };

        expect(() => {
            freeMessageResultService.onMessageReceived(
                buildFakeMessageEvent(
                    node.id,
                    protocol.withoutResponse,
                    JSON.stringify(freeMessageReceived)
                )
            )
        }).toThrow(new Error(`received message ${JSON.stringify(receivedMessage)} but there are no callbacks set`))
    });
});

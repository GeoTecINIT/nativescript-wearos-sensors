import { PlainMessageClient } from "nativescript-wearos-sensors/internal/communication/plain-message/plain-message-client";
import {
    PlainMessageAndroidClient
} from "nativescript-wearos-sensors/internal/communication/plain-message/android/plain-message-client.android";
import {
    PlainMessage,
    PlainMessageProtocol,
    ReceivedMessage
} from "nativescript-wearos-sensors/internal/communication/plain-message";
import {
    PlainMessageResultService
} from "nativescript-wearos-sensors/internal/communication/plain-message/android/plain-message-result-service.android";
import { Node } from "nativescript-wearos-sensors/internal/node";
import { buildFakeMessageEvent } from "~/tests/internal/index.spec";

describe("Plain message client", () => {

    const node: Node = new Node("test", "test");
    const protocol: PlainMessageProtocol = {
        withoutResponse: "test-no-response",
        expectingResponse: "test-expecting-response",
    };

    let plainMessageClient: PlainMessageClient;
    let plainMessageResultService: PlainMessageResultService;

    beforeEach(() => {
        plainMessageResultService = new PlainMessageResultService();
        spyOn(plainMessageResultService, "onMessageReceived").and.callThrough();
        plainMessageClient = new PlainMessageAndroidClient(
            protocol,
            plainMessageResultService
        );
        spyOn(plainMessageClient, "enabled").and.returnValue(true);
        spyOn<any>(plainMessageClient, "sendMessage").and.callFake(() => Promise.resolve());
    });

    it("sends a message to a node", async () => {
        const plainMessage: PlainMessage = {
            message: "test message"
        };

        await expectAsync(plainMessageClient.send(node, plainMessage)).toBeResolved();
    });

    it("sends a message expecting a response an a response is received", async () => {
        const plainMessage: PlainMessage = {
            message: "test message"
        };
        const plainResponse: PlainMessage = {
            message: "test response",
            inResponseTo: plainMessage
        }

        const receivedMessagePromise = plainMessageClient.sendExpectingResponse(node, plainMessage);

        plainMessageResultService.onMessageReceived(
            buildFakeMessageEvent(
                node.id,
                protocol.withoutResponse,
                JSON.stringify(plainResponse)
            )
        );

        const receivedMessage: ReceivedMessage = await receivedMessagePromise;

        expect(receivedMessage).toEqual({
            senderNodeId: node.id,
            plainMessage: plainResponse
        });
    });

    it("sends a message expecting a response but no response is received", async () => {
        const plainMessage: PlainMessage = {
            message: "test message"
        };

        await expectAsync(plainMessageClient.sendExpectingResponse(node, plainMessage, 100))
            .toBeRejectedWith(`Timeout for communication request in node ${node.name} (${node.id})`);
    });

    it("receives a wearable-triggered message", async () => {
        const plainMessageReceived: PlainMessage = {
            message: "message received from watch"
        };

        plainMessageClient.registerListener((receivedMessage) => {
            expect(receivedMessage).toEqual({
                senderNodeId: node.id,
                plainMessage: plainMessageReceived
            })
        });

        plainMessageResultService.onMessageReceived(
            buildFakeMessageEvent(
                node.id,
                protocol.withoutResponse,
                JSON.stringify(plainMessageReceived)
            )
        );

        await new Promise((resolve) => {
            setTimeout(resolve, 200)
        });
    });

    it("receives a wearable-triggered message but there is no listener attached", () => {
        const plainMessageReceived: PlainMessage = {
            message: "message received from watch"
        };
        const receivedMessage: ReceivedMessage = {
            senderNodeId: node.id,
            plainMessage: plainMessageReceived,
        };

        expect(() => {
            plainMessageResultService.onMessageReceived(
                buildFakeMessageEvent(
                    node.id,
                    protocol.withoutResponse,
                    JSON.stringify(plainMessageReceived)
                )
            )
        }).toThrow(new Error(`received message ${JSON.stringify(receivedMessage)} but there are no callbacks set`))
    });
});

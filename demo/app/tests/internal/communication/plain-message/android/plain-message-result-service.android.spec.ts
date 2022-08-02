import { Node } from "nativescript-wearos-sensors/internal/node";
import {
    PlainMessage,
    PlainMessageProtocol,
    ReceivedMessage
} from "nativescript-wearos-sensors/internal/communication/plain-message";
import {
    PlainMessageResultService
} from "nativescript-wearos-sensors/internal/communication/plain-message/android/plain-message-result-service.android";
import { buildFakeMessageEvent } from "~/tests/internal/index.spec";

describe("Plain message result service", () => {
    const node: Node = new Node("test", "test");
    const protocol: PlainMessageProtocol = {
        withoutResponse: "test-no-response",
        expectingResponse: "test-expecting-response",
    };
    const unknownPath = "suspicious-path";

    let resolutionCallback;
    let defaultListener;
    let plainMessageResultService: PlainMessageResultService;

    beforeEach(() => {
        resolutionCallback = jasmine.createSpy("resolutionCallbackSpy");
        defaultListener = jasmine.createSpy("defaultListenerSpy");
        plainMessageResultService = new PlainMessageResultService();
        plainMessageResultService.setProtocol(protocol);
        plainMessageResultService.setDefaultListener(defaultListener);
        plainMessageResultService.setResolutionCallbackForNode(node.id, resolutionCallback);
    });

    it("does nothing if receives a free message with an unknown protocol", () => {
        const messageEvent = buildFakeMessageEvent(node.id, unknownPath);
        plainMessageResultService.onMessageReceived(messageEvent);

        expect(resolutionCallback).not.toHaveBeenCalled();
        expect(defaultListener).not.toHaveBeenCalled();
    });

    it("does nothing when receives a free message without data", () => {
        const messageEvent = buildFakeMessageEvent(node.id, protocol.withoutResponse);
        plainMessageResultService.onMessageReceived(messageEvent);

        expect(resolutionCallback).not.toHaveBeenCalled();
        expect(defaultListener).not.toHaveBeenCalled();
    });

    it("receives a free message in response to other message", () => {
        const plainMessage: PlainMessage = {
            message: "Hi! :)",
            inResponseTo: {
                message: "Hey :P"
            }
        };
        const expectedResponse: ReceivedMessage = {
            senderNodeId: node.id,
            plainMessage
        };

        const messageEvent = buildFakeMessageEvent(node.id, protocol.withoutResponse, JSON.stringify(plainMessage));
        plainMessageResultService.onMessageReceived(messageEvent);

        expect(resolutionCallback).toHaveBeenCalledWith(expectedResponse);
        expect(defaultListener).not.toHaveBeenCalled();
    });

    it("receives a free message in response to other message but there are no listeners to handle it", () => {
        const plainMessage: PlainMessage = {
            message: "Hi! :)",
            inResponseTo: {
                message: "Hey :P"
            }
        };
        const expectedResponse: ReceivedMessage = {
            senderNodeId: node.id,
            plainMessage
        };
        const messageEvent = buildFakeMessageEvent(node.id, protocol.withoutResponse, JSON.stringify(plainMessage));
        (plainMessageResultService as any).resolutionCallbacks.delete(node.id);
        plainMessageResultService.clearDefaultListener();

        expect(() => { plainMessageResultService.onMessageReceived(messageEvent) })
            .toThrow(new Error(`received message ${JSON.stringify(expectedResponse)} but there are no callbacks set`));
        expect(resolutionCallback).not.toHaveBeenCalled();
        expect(defaultListener).not.toHaveBeenCalled();
    });

    it("receives a wearable-triggered message", () => {
        const plainMessage: PlainMessage = {
            message: "Hi! :)",
        };
        const expectedResponse: ReceivedMessage = {
            senderNodeId: node.id,
            plainMessage
        };

        const messageEvent = buildFakeMessageEvent(node.id, protocol.withoutResponse, JSON.stringify(plainMessage));
        plainMessageResultService.onMessageReceived(messageEvent);
        expect(resolutionCallback).not.toHaveBeenCalled();
        expect(defaultListener).toHaveBeenCalledWith(expectedResponse);
    });

    it("receives a wearable-triggered message but there are no listeners set", () => {
        const plainMessage: PlainMessage = {
            message: "Hi! :)",
        };
        const expectedResponse: ReceivedMessage = {
            senderNodeId: node.id,
            plainMessage
        };

        const messageEvent = buildFakeMessageEvent(node.id, protocol.withoutResponse, JSON.stringify(plainMessage));
        plainMessageResultService.clearDefaultListener();

        expect(() => { plainMessageResultService.onMessageReceived(messageEvent) })
            .toThrow(new Error(`received message ${JSON.stringify(expectedResponse)} but there are no callbacks set`));
        expect(resolutionCallback).not.toHaveBeenCalled();
        expect(defaultListener).not.toHaveBeenCalled();
    });
});

import { Node } from "nativescript-wearos-sensors/internal/node";
import {
    FreeMessage,
    FreeMessageProtocol,
    ReceivedMessage
} from "nativescript-wearos-sensors/internal/communication/free-message";
import {
    FreeMessageResultService
} from "nativescript-wearos-sensors/internal/communication/free-message/android/free-message-result-service.android";
import { buildFakeMessageEvent } from "~/tests/internal/index.spec";

describe("Free message result service", () => {
    const node: Node = new Node("test", "test");
    const protocol: FreeMessageProtocol = {
        withoutResponse: "test-no-response",
        expectingResponse: "test-expecting-response",
    };
    const unknownPath = "suspicious-path";

    let resolutionCallback;
    let defaultListener;
    let freeMessageResultService: FreeMessageResultService;

    beforeEach(() => {
        resolutionCallback = jasmine.createSpy("resolutionCallbackSpy");
        defaultListener = jasmine.createSpy("defaultListenerSpy");
        freeMessageResultService = new FreeMessageResultService();
        freeMessageResultService.setProtocol(protocol);
        freeMessageResultService.setDefaultListener(defaultListener);
        freeMessageResultService.setResolutionCallbackForNode(node.id, resolutionCallback);
    });

    it("does nothing if receives a free message with an unknown protocol", () => {
        const messageEvent = buildFakeMessageEvent(node.id, unknownPath);
        freeMessageResultService.onMessageReceived(messageEvent);

        expect(resolutionCallback).not.toHaveBeenCalled();
        expect(defaultListener).not.toHaveBeenCalled();
    });

    it("does nothing when receives a free message without data", () => {
        const messageEvent = buildFakeMessageEvent(node.id, protocol.withoutResponse);
        freeMessageResultService.onMessageReceived(messageEvent);

        expect(resolutionCallback).not.toHaveBeenCalled();
        expect(defaultListener).not.toHaveBeenCalled();
    });

    it("receives a free message in response to other message", () => {
        const freeMessage: FreeMessage = {
            message: "Hi! :)",
            inResponseTo: {
                message: "Hey :P"
            }
        };
        const expectedResponse: ReceivedMessage = {
            senderNodeId: node.id,
            freeMessage
        };

        const messageEvent = buildFakeMessageEvent(node.id, protocol.withoutResponse, JSON.stringify(freeMessage));
        freeMessageResultService.onMessageReceived(messageEvent);

        expect(resolutionCallback).toHaveBeenCalledWith(expectedResponse);
        expect(defaultListener).not.toHaveBeenCalled();
    });

    it("receives a free message in response to other message but there are no listeners to handle it", () => {
        const freeMessage: FreeMessage = {
            message: "Hi! :)",
            inResponseTo: {
                message: "Hey :P"
            }
        };
        const expectedResponse: ReceivedMessage = {
            senderNodeId: node.id,
            freeMessage
        };
        const messageEvent = buildFakeMessageEvent(node.id, protocol.withoutResponse, JSON.stringify(freeMessage));
        (freeMessageResultService as any).resolutionCallbacks.delete(node.id);
        freeMessageResultService.clearDefaultListener();

        expect(() => { freeMessageResultService.onMessageReceived(messageEvent) })
            .toThrow(new Error(`received message ${JSON.stringify(expectedResponse)} but there are no callbacks set`));
        expect(resolutionCallback).not.toHaveBeenCalled();
        expect(defaultListener).not.toHaveBeenCalled();
    });

    it("receives a wearable-triggered message", () => {
        const freeMessage: FreeMessage = {
            message: "Hi! :)",
        };
        const expectedResponse: ReceivedMessage = {
            senderNodeId: node.id,
            freeMessage
        };

        const messageEvent = buildFakeMessageEvent(node.id, protocol.withoutResponse, JSON.stringify(freeMessage));
        freeMessageResultService.onMessageReceived(messageEvent);
        expect(resolutionCallback).not.toHaveBeenCalled();
        expect(defaultListener).toHaveBeenCalledWith(expectedResponse);
    });

    it("receives a wearable-triggered message but there are no listeners set", () => {
        const freeMessage: FreeMessage = {
            message: "Hi! :)",
        };
        const expectedResponse: ReceivedMessage = {
            senderNodeId: node.id,
            freeMessage
        };

        const messageEvent = buildFakeMessageEvent(node.id, protocol.withoutResponse, JSON.stringify(freeMessage));
        freeMessageResultService.clearDefaultListener();

        expect(() => { freeMessageResultService.onMessageReceived(messageEvent) })
            .toThrow(new Error(`received message ${JSON.stringify(expectedResponse)} but there are no callbacks set`));
        expect(resolutionCallback).not.toHaveBeenCalled();
        expect(defaultListener).not.toHaveBeenCalled();
    });
});

import { ResultMessagingProtocol } from "nativescript-wearos-sensors/internal/messaging";
import { ResultMessagingListener } from "nativescript-wearos-sensors/internal/messaging/android/result-messaging-listener.android";
import { buildFakeMessageEvent, buildFakeResolutionResult } from "../..";

describe("Result Messaging Listener", () => {
    const nodeId = "testNode";
    const protocol: ResultMessagingProtocol = {
        messagePath: "testPath",
        successResponse: "testSuccessResponse",
        failureResponse: "testFailureResponse",
    };
    const unknownPath = "unknownPath";

    let resolutionCallback;
    let resultMessagingListener: ResultMessagingListener;

    beforeEach(() => {
        resolutionCallback = jasmine.createSpy("resolutionCallbackSpy");
        resultMessagingListener = new ResultMessagingListener(
            protocol,
            resolutionCallback
        );
    })

    it("does nothing if receives a message with an unknown protocol", () => {
        const messageEvent = buildFakeMessageEvent(nodeId, unknownPath);
        resultMessagingListener.onMessageReceived(messageEvent);

        expect(resolutionCallback).not.toHaveBeenCalled();
    });

    it("does nothing when receives a message without data", () => {
        const messageEvent = buildFakeMessageEvent(nodeId, protocol.messagePath);
        resultMessagingListener.onMessageReceived(messageEvent);

        expect(resolutionCallback).not.toHaveBeenCalled();
    });

    it("does nothing when receives a message with data not following the protocol", () => {
        const messageEvent = buildFakeMessageEvent(nodeId, protocol.messagePath, "random message");
        resultMessagingListener.onMessageReceived(messageEvent);

        expect(resolutionCallback).not.toHaveBeenCalled();
    });

    it("receives a success message and sends the resolution result to the callback", () => {
        const messageEvent = buildFakeMessageEvent(nodeId, protocol.messagePath, protocol.successResponse);
        const expectedResolution = buildFakeResolutionResult(nodeId, true);
        resultMessagingListener.onMessageReceived(messageEvent);

        expect(resolutionCallback).toHaveBeenCalledWith(expectedResolution);
    });

    it("receives a failure message without explanatory data and sends the resolution result to the callback", () => {
        const messageEvent = buildFakeMessageEvent(nodeId, protocol.messagePath, protocol.failureResponse);
        const expectedResolution = buildFakeResolutionResult(nodeId, false);
        resultMessagingListener.onMessageReceived(messageEvent);

        expect(resolutionCallback).toHaveBeenCalledWith(expectedResolution);
    });

    it("receives a failure message with explanatory data and sends the resolution result to the callback", () => {
        const explanatoryMessage = "Smartwatch exploded";
        const messageEvent = buildFakeMessageEvent(nodeId, protocol.messagePath, `${protocol.failureResponse}#${explanatoryMessage}`);
        const expectedResolution = buildFakeResolutionResult(nodeId, false, explanatoryMessage);
        resultMessagingListener.onMessageReceived(messageEvent);

        expect(resolutionCallback).toHaveBeenCalledWith(expectedResolution);
    });
});

import { ResultMessagingProtocol } from "nativescript-wearos-sensors/internal/communication/messaging";
import { buildFakeMessageEvent, buildFakeResolutionResult } from "../..";
import { MessagingResultService } from "nativescript-wearos-sensors/internal/communication/messaging/android/messaging-result-service.android";

describe("Result Messaging Service", () => {
    const nodeId = "testNode";
    const protocol: ResultMessagingProtocol = {
        messagePath: "testPath",
        successResponse: "testSuccessResponse",
        failureResponse: "testFailureResponse",
    };
    const unknownPath = "unknownPath";

    let resolutionCallback;
    let resultMessagingService: MessagingResultService;

    beforeEach(() => {
        resolutionCallback = jasmine.createSpy("resolutionCallbackSpy");
        resultMessagingService = new MessagingResultService();
        resultMessagingService.setProtocol(protocol);
        resultMessagingService.setResolutionCallback(resolutionCallback);
    })

    it("does nothing if receives a message with an unknown protocol", () => {
        const messageEvent = buildFakeMessageEvent(nodeId, unknownPath);
        resultMessagingService.onMessageReceived(messageEvent);

        expect(resolutionCallback).not.toHaveBeenCalled();
    });

    it("does nothing when receives a message without data", () => {
        const messageEvent = buildFakeMessageEvent(nodeId, protocol.messagePath);
        resultMessagingService.onMessageReceived(messageEvent);

        expect(resolutionCallback).not.toHaveBeenCalled();
    });

    it("does nothing when receives a message with data not following the protocol", () => {
        const messageEvent = buildFakeMessageEvent(nodeId, protocol.messagePath, "random message");
        resultMessagingService.onMessageReceived(messageEvent);

        expect(resolutionCallback).not.toHaveBeenCalled();
    });

    it("receives a success message and sends the resolution result to the callback", () => {
        const messageEvent = buildFakeMessageEvent(nodeId, protocol.messagePath, protocol.successResponse);
        const expectedResolution = buildFakeResolutionResult(nodeId, true);
        resultMessagingService.onMessageReceived(messageEvent);

        expect(resolutionCallback).toHaveBeenCalledWith(expectedResolution);
    });

    it("receives a failure message without explanatory data and sends the resolution result to the callback", () => {
        const messageEvent = buildFakeMessageEvent(nodeId, protocol.messagePath, protocol.failureResponse);
        const expectedResolution = buildFakeResolutionResult(nodeId, false);
        resultMessagingService.onMessageReceived(messageEvent);

        expect(resolutionCallback).toHaveBeenCalledWith(expectedResolution);
    });

    it("receives a failure message with explanatory data and sends the resolution result to the callback", () => {
        const explanatoryMessage = "Smartwatch exploded";
        const messageEvent = buildFakeMessageEvent(nodeId, protocol.messagePath, `${protocol.failureResponse}#${explanatoryMessage}`);
        const expectedResolution = buildFakeResolutionResult(nodeId, false, explanatoryMessage);
        resultMessagingService.onMessageReceived(messageEvent);

        expect(resolutionCallback).toHaveBeenCalledWith(expectedResolution);
    });
});

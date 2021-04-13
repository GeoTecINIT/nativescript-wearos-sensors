import { MessagingClientImpl } from "nativescript-wearos-sensors/internal/messaging/android/messaging-client.android";
import {
    buildFakeMessageEvent,
    buildFakeNode,
    buildFakeResolutionResult,
    getFakeMessagingProtocol
} from "~/tests/internal";
import { ResultMessagingService } from "nativescript-wearos-sensors/internal/messaging/android/result-messaging-service.android";

describe("Messaging client", () => {
    const node = buildFakeNode("node1", "node1", true);
    const protocol = getFakeMessagingProtocol();

    let resultMessagingService;
    let messagingClient;

    beforeEach(() => {
        resultMessagingService = new ResultMessagingService();
        messagingClient = new MessagingClientImpl(protocol, resultMessagingService);
        spyOn<any>(messagingClient, "sendMessage").and.callFake(() => Promise.resolve());
    });

    it("sends an isReady message to a ready node", async () => {
        const ready = messagingClient.sendIsReadyMessageAndWaitForResolution(node);
        resultMessagingService.onMessageReceived(
            buildFakeMessageEvent(
                node.getId(),
                protocol.readyProtocol.messagePath,
                protocol.readyProtocol.successResponse,
            )
        )

        await expectAsync(ready).toBeResolvedTo(
            buildFakeResolutionResult(node.getId(), true)
        );
    });

    it("sends an isReady message to a not ready node", async () => {
        const ready = messagingClient.sendIsReadyMessageAndWaitForResolution(node);
        resultMessagingService.onMessageReceived(
            buildFakeMessageEvent(
                node.getId(),
                protocol.readyProtocol.messagePath,
                protocol.readyProtocol.failureResponse,
            )
        )

        await expectAsync(ready).toBeResolvedTo(
            buildFakeResolutionResult(node.getId(), false)
        );
    });

    it("sends a prepare message to a node, which is successfully prepared", async () => {
        const ready = messagingClient.sendPrepareMessageAndWaitForResolution(node);
        resultMessagingService.onMessageReceived(
            buildFakeMessageEvent(
                node.getId(),
                protocol.prepareProtocol.messagePath,
                protocol.prepareProtocol.successResponse,
            )
        )

        await expectAsync(ready).toBeResolvedTo(
            buildFakeResolutionResult(node.getId(), true)
        );
    });

    it("sends a prepare message to a node, which is not successfully prepared", async () => {
        const ready = messagingClient.sendPrepareMessageAndWaitForResolution(node);
        resultMessagingService.onMessageReceived(
            buildFakeMessageEvent(
                node.getId(),
                protocol.prepareProtocol.messagePath,
                `${protocol.prepareProtocol.failureResponse}#Smartwatch exploded`,
            )
        )

        await expectAsync(ready).toBeResolvedTo(
            buildFakeResolutionResult(node.getId(), false, "Smartwatch exploded")
        );
    });
});

import {
    buildFakeMessageEvent,
    buildFakeResolutionResult,
    getFakeMessagingProtocol
} from "~/tests/internal";
import { Node } from "nativescript-wearos-sensors/internal/node";
import { MessagingResultService } from "nativescript-wearos-sensors/internal/communication/messaging/android/messaging-result-service.android";
import { MessagingClientImpl } from "nativescript-wearos-sensors/internal/communication/messaging/android/messaging-client.android";

describe("Messaging client", () => {
    const node = new Node("node1", "node1", []);
    const protocol = getFakeMessagingProtocol();

    let resultMessagingService;
    let messagingClient;

    beforeEach(() => {
        resultMessagingService = new MessagingResultService();
        messagingClient = new MessagingClientImpl(protocol, resultMessagingService);
        spyOn<any>(messagingClient, "sendMessage").and.callFake(() => Promise.resolve());
    });

    it("sends an isReady message to a ready node", async () => {
        const ready = messagingClient.sendIsReadyMessage(node);
        resultMessagingService.onMessageReceived(
            buildFakeMessageEvent(
                node.id,
                protocol.readyProtocol.messagePath,
                protocol.readyProtocol.successResponse,
            )
        )

        await expectAsync(ready).toBeResolvedTo(
            buildFakeResolutionResult(node.id, true)
        );
    });

    it("sends an isReady message to a not ready node", async () => {
        const ready = messagingClient.sendIsReadyMessage(node);
        resultMessagingService.onMessageReceived(
            buildFakeMessageEvent(
                node.id,
                protocol.readyProtocol.messagePath,
                protocol.readyProtocol.failureResponse,
            )
        )

        await expectAsync(ready).toBeResolvedTo(
            buildFakeResolutionResult(node.id, false)
        );
    });

    it("sends a prepare message to a node, which is successfully prepared", async () => {
        const ready = messagingClient.sendPrepareMessage(node);
        resultMessagingService.onMessageReceived(
            buildFakeMessageEvent(
                node.id,
                protocol.prepareProtocol.messagePath,
                protocol.prepareProtocol.successResponse,
            )
        )

        await expectAsync(ready).toBeResolvedTo(
            buildFakeResolutionResult(node.id, true)
        );
    });

    it("sends a prepare message to a node, which is not successfully prepared", async () => {
        const ready = messagingClient.sendPrepareMessage(node);
        resultMessagingService.onMessageReceived(
            buildFakeMessageEvent(
                node.id,
                protocol.prepareProtocol.messagePath,
                `${protocol.prepareProtocol.failureResponse}#Smartwatch exploded`,
            )
        )

        await expectAsync(ready).toBeResolvedTo(
            buildFakeResolutionResult(node.id, false, "Smartwatch exploded")
        );
    });
});
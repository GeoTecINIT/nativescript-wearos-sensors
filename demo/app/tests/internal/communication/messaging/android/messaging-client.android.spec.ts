import {
    buildFakeMessageEvent,
    buildFakeResolutionResult,
    getFakeMessagingProtocol
} from "~/tests/internal/index.spec";
import { Node } from "nativescript-wearos-sensors/internal/node";
import { MessagingResultService } from "nativescript-wearos-sensors/internal/communication/messaging/android/messaging-result-service.android";
import { MessagingClientImpl } from "nativescript-wearos-sensors/internal/communication/messaging/android/messaging-client.android";
import { SensorType } from "nativescript-wearos-sensors/internal/sensors/sensor-type";
import { MessagingClient } from "nativescript-wearos-sensors/internal/communication/messaging/messaging-client";

describe("Messaging client", () => {
    const node = new Node("node1", "node1", []);
    const protocol = getFakeMessagingProtocol();

    let resultMessagingService: MessagingResultService;
    let messagingClient: MessagingClient;

    beforeEach(() => {
        resultMessagingService = new MessagingResultService();

        messagingClient = new MessagingClientImpl(SensorType.ACCELEROMETER, protocol, resultMessagingService);
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

    it("sends an isReady message to a node but it does not reply", async () => {
        jasmine.clock().install();
        const ready = messagingClient.sendIsReadyMessage(node);

        jasmine.clock().tick(5000);
        await expectAsync(ready).toBeRejectedWith(`Timeout for communication request in node ${node.name} (${node.id})`);

        jasmine.clock().uninstall();
    });

    it("sends a prepare message to a node, which is successfully prepared", async () => {
        const prepared = messagingClient.sendPrepareMessage(node);
        resultMessagingService.onMessageReceived(
            buildFakeMessageEvent(
                node.id,
                protocol.prepareProtocol.messagePath,
                protocol.prepareProtocol.successResponse,
            )
        )

        await expectAsync(prepared).toBeResolvedTo(
            buildFakeResolutionResult(node.id, true)
        );
    });

    it("sends a prepare message to a node, which is not successfully prepared", async () => {
        const prepared = messagingClient.sendPrepareMessage(node);
        resultMessagingService.onMessageReceived(
            buildFakeMessageEvent(
                node.id,
                protocol.prepareProtocol.messagePath,
                `${protocol.prepareProtocol.failureResponse}#Smartwatch exploded`,
            )
        )

        await expectAsync(prepared).toBeResolvedTo(
            buildFakeResolutionResult(node.id, false, "Smartwatch exploded")
        );
    });
});

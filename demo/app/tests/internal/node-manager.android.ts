import { wearOS } from "nativescript-wearos-sensors/internal/utils/android/wear-os-types.android";
import { MessagingProtocol } from "nativescript-wearos-sensors/internal/messaging";
import { NodeManager } from "nativescript-wearos-sensors/internal/node-manager.android";
import { MessagingClientImpl } from "nativescript-wearos-sensors/internal/messaging/android/messaging-client.android";
import { encodeMessage } from "nativescript-wearos-sensors/internal/messaging/messaging-client";
import { buildFakeNode } from ".";

describe("Node manager", () => {
    const node = buildFakeNode("node1", "node1", true);
    const protocol: MessagingProtocol = {
        startMessagePath: "testStart",
        stopMessagePath: "testStop",
        readyProtocol: {
            messagePath: "testReady",
            successResponse: "testReadySuccess",
            failureResponse: "testReadyFailure",
        },
        prepareProtocol: {
            messagePath: "testPrepare",
            successResponse: "testPrepareSuccess",
            failureResponse: "testPrepareFailure",
        },
        newRecordMessagePath: "testNewRecord",
    }

    let messagingClient;
    let nodeManager;

    beforeEach(() => {
        messagingClient = new MessagingClientImpl(protocol);
        spyOn(messagingClient, "registerMessageListener").and.callThrough();
        spyOn(messagingClient, "sendIsReadyMessage").and.returnValue(null);
        spyOn(messagingClient, "sendPrepareMessage").and.returnValue(null);
        nodeManager = new NodeManager(node, protocol, messagingClient);
    })

    it("allows to ask a ready node if it is ready", async () => {
        const isReady = nodeManager.isReady();
        const resultMessagingListener = retrieveMessagingListener(messagingClient);
        resultMessagingListener.onMessageReceived(
            buildFakeMessageEvent(
                node.getId(),
                protocol.readyProtocol.messagePath,
                protocol.readyProtocol.successResponse
            )
        );

        const resolutionResult = await isReady;
        expect(resolutionResult.success).toBeTrue();
        expect(resolutionResult.nodeId).toBe(node.getId());
        expect(resolutionResult.message).toBeUndefined();
    });

    it("allows to ask a not ready node if it is ready", async () => {
        const isReady = nodeManager.isReady();
        const resultMessagingListener = retrieveMessagingListener(messagingClient);
        resultMessagingListener.onMessageReceived(
            buildFakeMessageEvent(
                node.getId(),
                protocol.readyProtocol.messagePath,
                protocol.readyProtocol.failureResponse
            )
        );

        const resolutionResult = await isReady;
        expect(resolutionResult.success).toBeFalse();
        expect(resolutionResult.nodeId).toBe(node.getId());
        expect(resolutionResult.message).toBeUndefined();
    });

    it("allows to prepare a node, and it is successfully prepared", async () => {
        const prepare = nodeManager.prepare();
        const resultMessagingListener = retrieveMessagingListener(messagingClient);
        resultMessagingListener.onMessageReceived(
            buildFakeMessageEvent(
                node.getId(),
                protocol.prepareProtocol.messagePath,
                protocol.prepareProtocol.successResponse
            )
        );

        await expectAsync(prepare).not.toBeRejected();
    });

    it("allows to prepare a node, and it can't be successfully prepared", async () => {
        const prepare = nodeManager.prepare();
        const resultMessagingListener = retrieveMessagingListener(messagingClient);
        resultMessagingListener.onMessageReceived(
            buildFakeMessageEvent(
                node.getId(),
                protocol.prepareProtocol.messagePath,
                `${protocol.prepareProtocol.failureResponse}#Smartwatch exploded`
            )
        );

        await expectAsync(prepare).toBeRejectedWithError(
            `Node ${node.getId()}(${node.getDisplayName()}): could not prepare sensor. Reason: Smartwatch exploded`
        );
    });
});

function buildFakeMessageEvent(
    nodeId: string,
    path: string,
    message: string
): wearOS.MessageEvent {
    return new wearOS.MessageEvent({
        getData(): native.Array<number> {
            return encodeMessage(message);
        },
        getPath(): string {
            return path;
        },
        getRequestId(): number {
            return 53;
        },
        getSourceNodeId(): string {
            return nodeId;
        }
    });
}

function retrieveMessagingListener(messagingClient) {
    return messagingClient.registerMessageListener.calls.mostRecent().args[0];
}
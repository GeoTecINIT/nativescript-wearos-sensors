import { Node } from "nativescript-wearos-sensors/internal/node";
import { SensorType } from "nativescript-wearos-sensors/internal/sensors/sensor-type";
import { MessagingClient } from "nativescript-wearos-sensors/internal/communication/messaging/messaging-client";
import { CollectorManagerImpl } from "nativescript-wearos-sensors/internal/collection/android/collector-manager-impl.android";
import { buildFakeResolutionResult } from "~/tests/internal/index.spec";
import { CollectorManager } from "nativescript-wearos-sensors/internal/collection/collector-manager";

describe("Collector manager implementation", () => {
    const node1 = new Node("node1", "node1", [SensorType.ACCELEROMETER, SensorType.GYROSCOPE]);
    const node2 = new Node("node2", "node2", [SensorType.ACCELEROMETER, SensorType.LOCATION]);
    const node3 = new Node("node3", "node3", [SensorType.HEART_RATE]);

    let messagingClient;
    let collectorManager: CollectorManager;

    beforeEach(() => {
        messagingClient = buildFakeMessagingClient();
        collectorManager = new CollectorManagerImpl((_) => messagingClient, null);
    });

    it("isReady returns true when a node has a determined capability and false otherwise", async() => {
        spyOn(messagingClient, "sendIsReadyMessage")
            .withArgs(node1).and.resolveTo(
                buildFakeResolutionResult(node1.id, true)
            )
            .withArgs(node2).and.resolveTo(
                buildFakeResolutionResult(node1.id, true)
            );

        const node1Ready = await collectorManager.isReady(node1, SensorType.ACCELEROMETER);
        const node2Ready = await collectorManager.isReady(node2, SensorType.ACCELEROMETER);
        const node3Ready = await collectorManager.isReady(node3, SensorType.ACCELEROMETER);

        expect(node1Ready).toBeTrue();
        expect(node2Ready).toBeTrue();
        expect(node3Ready).toBeFalse();
        expect(messagingClient.sendIsReadyMessage).toHaveBeenCalledTimes(2);
        expect(messagingClient.sendIsReadyMessage).not.toHaveBeenCalledWith(node3);
    });

    it("prepare do not try to prepare a node which has not a determined capability", async () => {
        spyOn(messagingClient, "sendPrepareMessage");

        const error = await collectorManager.prepare(node3, SensorType.ACCELEROMETER);

        expect(error).toEqual({
            node: node3,
            message: "Node node3 (node3) has not ACCELEROMETER available"
        });
    });

    it("prepare tries to prepare nodes, returning a prepare error is node couldn't be prepared", async () => {
        spyOn(messagingClient, "sendPrepareMessage")
            .withArgs(node1).and.resolveTo(
                buildFakeResolutionResult(node1.id, true)
            )
            .withArgs(node2).and.resolveTo(
                buildFakeResolutionResult(node2.id, false, "Smartwatch burst into flames")
            );

        const errorNode1 = await collectorManager.prepare(node1, SensorType.ACCELEROMETER);
        const errorNode2 = await collectorManager.prepare(node2, SensorType.ACCELEROMETER);

        expect(errorNode1).toBeUndefined();
        expect(errorNode2).toEqual({
            node: node2,
            message: "Smartwatch burst into flames"
        });
    });
});

function buildFakeMessagingClient(): MessagingClient {
    return {
        sendIsReadyMessage(node: Node) {
            return null;
        },
        sendPrepareMessage(node: Node) {
            return null;
        },
        sendStartMessage(node: Node, message?: string){},
        sendStopMessage(node: Node, message?: string){}
    }
}

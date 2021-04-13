import { buildFakeNode, buildFakeResolutionResult, getFakeMessagingProtocol } from ".";
import { CollectorManagerImpl } from "nativescript-wearos-sensors/internal/collector-manager-impl.android";
import { NodeManager } from "nativescript-wearos-sensors/internal/node-manager.android";
import { MessagingClientImpl } from "nativescript-wearos-sensors/internal/messaging/android/messaging-client.android";
import { ResultMessagingService } from "nativescript-wearos-sensors/internal/messaging/android/result-messaging-service.android";

describe("Collector manager implementation", () => {
    const protocol = getFakeMessagingProtocol();
    const capability = "fakeCapability";

    const messagingClient = new MessagingClientImpl(protocol, new ResultMessagingService());

    const node1 = buildFakeNode("node1", "node1", true);
    const node2 = buildFakeNode("node2", "node2", true);
    const node3 = buildFakeNode("node3", "node3", true);
    const nodes = new Map([
        [ node1.getId(), new NodeManager(node1, messagingClient)],
        [ node2.getId(), new NodeManager(node2, messagingClient)],
        [ node3.getId(), new NodeManager(node3, messagingClient)]
    ]);

    let collectorManager;

    beforeEach(() => {
        collectorManager = new CollectorManagerImpl(protocol, capability, messagingClient, null);
        spyOn<any>(collectorManager, "getAvailableNodes").and.resolveTo(nodes);
    });

    it("isReady returns false when there are no available nodes", async() => {
        collectorManager.getAvailableNodes.and.resolveTo(new Map());

        const allReady = await collectorManager.isReady();
        expect(allReady).toBeFalse();
    });

    it("allows to check if all available nodes are ready, and they are", async () => {
        nodes.forEach((node) => {
            spyOn(node, "isReady").and.resolveTo(
                buildFakeResolutionResult(node.getNodeId(), true)
            );
        });

        const allReady = await collectorManager.isReady();
        expect(allReady).toBeTrue();
        expect(collectorManager.idsPrepared).toEqual([node1.getId(), node2.getId(), node3.getId()]);
        expect(collectorManager.idsToBePrepared).toEqual([]);
    });

    it("allows to check if all available nodes are ready, but not all are ready", async () => {
        nodes.forEach((node) => {
            spyOn(node, "isReady").and.resolveTo(
                node.getNode() === node2 ?
                    buildFakeResolutionResult(node.getNodeId(), false) :
                    buildFakeResolutionResult(node.getNodeId(), true)
            );
        });

        const allReady = await collectorManager.isReady();
        expect(allReady).toBeFalse();
        expect(collectorManager.idsPrepared).toEqual([node1.getId(), node3.getId()]);
        expect(collectorManager.idsToBePrepared).toEqual([node2.getId()]);
    });

    it("does nothing when prepare is called and all nodes are ready", async () => {
        nodes.forEach((node) => {
            spyOn(node, "isReady").and.resolveTo(
                buildFakeResolutionResult(node.getNodeId(), true)
            );
            spyOn(node, "prepare");
        });

        await collectorManager.isReady();
        const prepareErrors = await collectorManager.prepare();

        nodes.forEach((node) => {
            expect(node.prepare).not.toHaveBeenCalled();
        });
        expect(prepareErrors).toEqual([]);
    });

    it("allows to prepare all not ready nodes", async () => {
        nodes.forEach((node) => {
            spyOn(node, "isReady").and.resolveTo(
                node.getNode() === node2 ?
                    buildFakeResolutionResult(node.getNodeId(), false) :
                    buildFakeResolutionResult(node.getNodeId(), true)
            );
            spyOn(node, "prepare").and.resolveTo(
                buildFakeResolutionResult(node.getNodeId(), true)
            );
        });

        await collectorManager.isReady();
        const prepareErrors = await collectorManager.prepare();

        nodes.forEach((node) => {
            node.getNode() === node2 ?
                expect(node.prepare).toHaveBeenCalled():
                expect(node.prepare).not.toHaveBeenCalled();
        });
        expect(collectorManager.idsPrepared).toEqual([node1.getId(), node3.getId(), node2.getId()]);
        expect(prepareErrors).toEqual([]);
    });

    it("allows to prepare some of the not ready nodes while others can't be prepared", async () => {
        nodes.forEach((node) => {
            spyOn(node, "isReady").and.resolveTo(
                buildFakeResolutionResult(node.getNodeId(), false)
            );
            spyOn(node, "prepare").and.resolveTo(
                node.getNode() === node2 ?
                    buildFakeResolutionResult(node.getNodeId(), false, "Smartwatch exploded"):
                    buildFakeResolutionResult(node.getNodeId(), true)
            );
        });

        await collectorManager.isReady();
        const prepareErrors = await collectorManager.prepare();

        nodes.forEach((node) => {
            expect(node.prepare).toHaveBeenCalled()
        });
        expect(collectorManager.idsPrepared).toEqual([node1.getId(), node3.getId()]);
        expect(prepareErrors[0]).toEqual({
            node: node2,
            message: "Smartwatch exploded",
        });
    });

    it("allows to start the collection with the nodes that are prepared", async () => {
        nodes.forEach((node) => {
            spyOn(node, "isReady").and.resolveTo(
                node.getNode() === node2 ?
                    buildFakeResolutionResult(node.getNodeId(), false) :
                    buildFakeResolutionResult(node.getNodeId(), true)
            );
            spyOn(node, "prepare").and.resolveTo(
                buildFakeResolutionResult(node.getNodeId(), false, "Smartwatch exploded")
            );
            spyOn(node, "startCollecting").and.callFake(() => Promise.resolve());
        });

        await collectorManager.isReady();
        await collectorManager.prepare();
        await collectorManager.startCollecting();

        nodes.forEach((node) => {
            expect(node.isReady).toHaveBeenCalled();
            if (node.getNode() === node2) {
                expect(node.prepare).toHaveBeenCalled();
                expect(node.startCollecting).not.toHaveBeenCalled();
            } else {
                expect(node.prepare).not.toHaveBeenCalled();
                expect(node.startCollecting).toHaveBeenCalled();
            }
        });
    });

    it("allows to stop the collection with the nodes that are prepared", async () => {
        nodes.forEach((node) => {
            spyOn(node, "isReady").and.resolveTo(
                node.getNode() === node2 ?
                    buildFakeResolutionResult(node.getNodeId(), false) :
                    buildFakeResolutionResult(node.getNodeId(), true)
            );
            spyOn(node, "prepare").and.resolveTo(
                buildFakeResolutionResult(node.getNodeId(), false, "Smartwatch exploded")
            );
            spyOn(node, "stopCollecting").and.callFake(() => Promise.resolve());
        });

        await collectorManager.isReady();
        await collectorManager.prepare();
        await collectorManager.stopCollecting();

        nodes.forEach((node) => {
            expect(node.isReady).toHaveBeenCalled();
            if (node.getNode() === node2) {
                expect(node.prepare).toHaveBeenCalled();
                expect(node.stopCollecting).not.toHaveBeenCalled();
            } else {
                expect(node.prepare).not.toHaveBeenCalled();
                expect(node.stopCollecting).toHaveBeenCalled();
            }
        });
    });
});

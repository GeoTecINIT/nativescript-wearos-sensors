import { NodeDiscoverer } from "nativescript-wearos-sensors/internal/node/discoverer/node-discoverer";
import { wearOS, WearOsNode } from "nativescript-wearos-sensors/internal/utils/android/wear-os-types.android";
import { CapabilityClient } from "nativescript-wearos-sensors/internal/communication/capabilities/android/capability-client.android";
import { Node } from "nativescript-wearos-sensors/internal/node";
import { CapabilityAdvertisementResult } from "nativescript-wearos-sensors/internal/communication/capabilities/android/capability-advertiser-result-service.android";
import { AndroidNodeDiscoverer } from "nativescript-wearos-sensors/internal/node/discoverer/node-discoverer.android";
import { buildFakeNode } from "~/tests/internal/index.spec";
import { SensorType } from "nativescript-wearos-sensors/internal/sensors/sensor-type";

const TIMEOUT = 100;

describe("Node discoverer", () => {

    let nodeClient: wearOS.NodeClient;
    let capabilityClient: CapabilityClient;
    let nodeDiscoverer: NodeDiscoverer;

    const node1 = buildNode("node1", "node1");
    const node1Capabilities = [SensorType.ACCELEROMETER, SensorType.GYROSCOPE];
    const node1WithCapabilities = buildNode(node1.id, node1.name, node1Capabilities);

    const node2 = buildNode("node2", "node2");
    const node2Capabilities = [SensorType.LOCATION, SensorType.HEART_RATE];
    const node2WithCapabilities = buildNode(node2.id, node2.name, node2Capabilities);

    const node3 = buildNode("node3", "node3");

    beforeEach(() => {
        nodeClient = buildFakeNodeClient();
        capabilityClient = buildFakeCapabilityClient();

        nodeDiscoverer = new AndroidNodeDiscoverer(capabilityClient, nodeClient);
    })

    it("returns an empty list when there are no connected nodes",async () => {
        const fakeConnectedNodesResult = buildFakeConnectedNodesResult(true, []);
        const fakeConnectedNodesRequest = buildFakeConnectedNodesRequest(fakeConnectedNodesResult);

        spyOn(nodeClient, "getConnectedNodes").and.returnValue(
            fakeConnectedNodesRequest
        );
        spyOn(capabilityClient, "sendCapabilityAdvertisementRequest").and.callThrough();

        const connectedNodesPromise = nodeDiscoverer.getConnectedNodes(TIMEOUT);
        fakeConnectedNodesRequest.complete();
        const connectedNodes = await connectedNodesPromise;
        expect(connectedNodes.length).toBe(0);
    });

    it("returns an empty list when the connected nodes request has been not successful",  async () => {
        spyOn(nodeClient, "getConnectedNodes").and.rejectWith();

        const nodesDiscovered = await nodeDiscoverer.getConnectedNodes();
        expect(nodesDiscovered.length).toBe(0);
    });

    it("given two connected nodes which advertise capabilities, returns a list with them", async () => {
        const fakeConnectedNodesResult = buildFakeConnectedNodesResult(true, [
            buildFakeNode(node1.id, node1.name, true),
            buildFakeNode(node2.id, node2.name, true)
        ]);
        const fakeConnectedNodesRequest = buildFakeConnectedNodesRequest(fakeConnectedNodesResult);
        spyOn(nodeClient, "getConnectedNodes").and.returnValue(
            fakeConnectedNodesRequest
        );
        spyOn(capabilityClient, "sendCapabilityAdvertisementRequest")
            .withArgs(node1, TIMEOUT).and.returnValue(Promise.resolve({ nodeId: node1.id, capabilities: node1Capabilities}))
            .withArgs(node2, TIMEOUT).and.returnValue(Promise.resolve({ nodeId: node2.id, capabilities: node2Capabilities}));

        const connectedNodesPromise = nodeDiscoverer.getConnectedNodes(TIMEOUT);
        fakeConnectedNodesRequest.complete();
        const connectedNodes = await connectedNodesPromise;

        expect(capabilityClient.sendCapabilityAdvertisementRequest).toHaveBeenCalledTimes(2);
        expect(connectedNodes.length).toBe(2);
        expect(connectedNodes[0].node).toEqual(node1WithCapabilities);
        expect(connectedNodes[0].error).toBeUndefined();
        expect(connectedNodes[1].node).toEqual(node2WithCapabilities);
        expect(connectedNodes[1].error).toBeUndefined();
    });

    it("given two connected nodes which only one of them advertise capabilities, returns a list with that node", async () => {
        const fakeConnectedNodesResult = buildFakeConnectedNodesResult(true, [
            buildFakeNode(node1.id, node1.name, true),
            buildFakeNode(node3.id, node3.name, true)
        ]);
        const fakeConnectedNodesRequest = buildFakeConnectedNodesRequest(fakeConnectedNodesResult);
        spyOn(nodeClient, "getConnectedNodes").and.returnValue(
            fakeConnectedNodesRequest
        );
        spyOn(capabilityClient, "sendCapabilityAdvertisementRequest")
            .withArgs(node1, TIMEOUT).and.returnValue(Promise.resolve({ nodeId: node1.id, capabilities: node1Capabilities}))
            .withArgs(node3, TIMEOUT).and.returnValue(Promise.reject("TEST: timeout for capability advertisement response"));

        const connectedNodesPromise = nodeDiscoverer.getConnectedNodes(TIMEOUT);
        fakeConnectedNodesRequest.complete();
        const connectedNodes = await connectedNodesPromise;

        expect(capabilityClient.sendCapabilityAdvertisementRequest).toHaveBeenCalledTimes(2);
        expect(connectedNodes.length).toBe(2);
        expect(connectedNodes[0].node).toEqual(node1WithCapabilities);
        expect(connectedNodes[0].error).toBeUndefined();
        expect(connectedNodes[1].node).toEqual(node3);
        expect(connectedNodes[1].error).toEqual("TEST: timeout for capability advertisement response");
    });
})

function buildFakeNodeClient(): wearOS.NodeClient {
    return {
        getConnectedNodes() {
            return null;
        }
    } as unknown as wearOS.NodeClient;
}

function buildFakeConnectedNodesRequest(taskResult) {
    return {
        completeListener: null,
        addOnCompleteListener(listener) {
            this.completeListener = listener.onComplete;
        },
        complete() {
            this.completeListener(taskResult);
        }
    } as unknown as com.google.android.gms.tasks.Task<java.util.List<WearOsNode>> & CompletableTask
}

interface CompletableTask {
    complete(): void
}

function buildFakeConnectedNodesResult(successful: boolean, nodes: WearOsNode[]) {
    return {
        isSuccessful() {
            return successful;
        },
        getResult() {
            const connectedNodes = new java.util.LinkedList<WearOsNode>();
            nodes.forEach((node) => connectedNodes.add(node));
            return connectedNodes;
        },
        getException() {
            return new java.lang.Exception("Task not successful because of reasons");
        }
    };
}

function buildFakeCapabilityClient(): CapabilityClient {
    return {
        sendCapabilityAdvertisementRequest(node: Node): Promise<CapabilityAdvertisementResult> {
            return null;
        }
    } as unknown as CapabilityClient;
}

function buildNode(id: string, name: string, capabilities?: SensorType[]): Node {
    return new Node(id, name, capabilities);
}


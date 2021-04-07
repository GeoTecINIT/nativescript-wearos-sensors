import { wearOS, Node } from "nativescript-wearos-sensors/internal/utils/android/wear-os-types.android";
import { CapabilityDiscoverer } from "nativescript-wearos-sensors/internal/capability-discoverer.android";

const SUPPORTED_CAPABILITY = "supportedCapability";
const UNSUPPORTED_CAPABILITY = "unsupportedCapability";


describe("Capability discoverer", () => {
    let capabilityClient: wearOS.CapabilityClient;

    beforeEach(() => {
        capabilityClient = buildFakeCapabilityClient();
    })

    it("searches for a capability and returns the available nodes", async () => {
        const capabilityDiscoverer = new CapabilityDiscoverer(SUPPORTED_CAPABILITY, capabilityClient);
        const fakeCapabilityRequest = buildFakeCapabilityRequest(SUPPORTED_CAPABILITY, true);
        spyOn(capabilityClient, "getCapability").and.returnValue(
            fakeCapabilityRequest
        );

        const availableNodes = capabilityDiscoverer.getAvailableNodes();
        fakeCapabilityRequest.complete();
        const nodes = await availableNodes;

        expect(nodes).not.toBeUndefined();
        expect(nodes.size()).toBe(2);
    });

    it("searches for a capability, but there aren't available nodes", async () => {
        const capabilityDiscoverer = new CapabilityDiscoverer(UNSUPPORTED_CAPABILITY, capabilityClient);
        const fakeCapabilityRequest = buildFakeCapabilityRequest(UNSUPPORTED_CAPABILITY, true);
        spyOn(capabilityClient, "getCapability").and.returnValue(
            fakeCapabilityRequest
        );

        const availableNodes = capabilityDiscoverer.getAvailableNodes();
        fakeCapabilityRequest.complete();
        const nodes = await availableNodes;

        expect(nodes).not.toBeUndefined();
        expect(nodes.size()).toBe(0);
    });

    it("capability request fails and propagates the error", async () => {
        const capabilityDiscoverer = new CapabilityDiscoverer(SUPPORTED_CAPABILITY, capabilityClient);
        const fakeCapabilityRequest = buildFakeCapabilityRequest(SUPPORTED_CAPABILITY, false);
        spyOn(capabilityClient, "getCapability").and.returnValue(
            fakeCapabilityRequest
        );

        const availableNodes = capabilityDiscoverer.getAvailableNodes();
        fakeCapabilityRequest.complete();

        await expectAsync(availableNodes).toBeRejectedWith("Task not successful because of reasons");
    });
});

function buildFakeCapabilityClient(): wearOS.CapabilityClient {
    return {
        getCapability(capability: string, filter: number) {
            return null;
        }
    } as unknown as wearOS.CapabilityClient;
}

function buildFakeCapabilityRequest(capability: string, successful: boolean) {
    return {
        completeListener: null,
        addOnCompleteListener(listener) {
            this.completeListener = listener.onComplete;
        },
        complete() {
            this.completeListener(buildFakeTaskResult(capability, successful))
        }
    } as unknown as com.google.android.gms.tasks.Task<wearOS.CapabilityInfo>&CompletableTask;
}

interface CompletableTask {
    complete(): void;
}

function buildFakeTaskResult(capability: string, successful: boolean) {
    return {
        isSuccessful() {
            return successful;
        },
        getResult() {
            return {
                getNodes() {
                    const set = new java.util.HashSet<Node>();
                    if (capability === SUPPORTED_CAPABILITY) {
                        set.add(buildFakeNode("node1", "node1", true));
                        set.add(buildFakeNode("node2", "node2", true));
                    }

                    return set;
                }
            }
        },
        getException() {
            return new java.lang.Exception("Task not successful because of reasons");
        }
    };
}

function buildFakeNode(id: string, name: string, nearby: boolean): Node {
    return new wearOS.Node({
        getId(): string {
            return id;
        },
        getDisplayName(): string {
            return name;
        },
        isNearby(): boolean {
            return nearby;
        }
    })
}

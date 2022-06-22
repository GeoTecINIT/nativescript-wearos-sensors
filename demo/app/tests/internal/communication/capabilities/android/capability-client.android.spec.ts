import { Node } from "nativescript-wearos-sensors/internal/node";
import { SensorType } from "nativescript-wearos-sensors/internal/sensors/sensor-type";
import { CapabilityClient } from "nativescript-wearos-sensors/internal/communication/capabilities/android/capability-client.android";
import { CapabilityAdvertiserResultService } from "nativescript-wearos-sensors/internal/communication/capabilities/android/capability-advertiser-result-service.android";
import { buildFakeMessageEvent } from "~/tests/internal/index.spec";

describe("Capability client", () => {
    const node = new Node("node1", "node1", []);
    const capabilities = [ SensorType.ACCELEROMETER, SensorType.LOCATION ];
    const protocol = {
        messagePath: "advertise-capabilities"
    };

    let capabilityAdvertiserService: CapabilityAdvertiserResultService;
    let capabilityClient: CapabilityClient;

    beforeEach(() => {
        capabilityAdvertiserService = new CapabilityAdvertiserResultService();
        capabilityClient = new CapabilityClient(protocol, capabilityAdvertiserService);
        spyOn<any>(capabilityClient, "sendMessage").and.callFake(() => Promise.resolve());
    })

    it("sends a capability advertisement request to a node and returns a response", async () => {
        const response = capabilityClient.sendCapabilityAdvertisementRequest(node, 1000);
        capabilityAdvertiserService.onMessageReceived(
            buildFakeMessageEvent(
                node.id,
                protocol.messagePath,
                capabilities.join("#")
            )
        );

        await expectAsync(response).toBeResolvedTo({
            nodeId: node.id,
            capabilities: capabilities
        });
    });


    it("sends a capability advertisement request to a node but it not responds", async () => {
        jasmine.clock().install();
        const response = capabilityClient.sendCapabilityAdvertisementRequest(node, 500);
        jasmine.clock().tick(500);

        await expectAsync(response).toBeRejectedWith(`Timeout for communication request in node ${node.name} (${node.id})`);

        jasmine.clock().uninstall();
    });
});

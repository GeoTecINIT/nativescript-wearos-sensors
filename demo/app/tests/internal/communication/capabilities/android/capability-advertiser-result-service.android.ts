import { Node } from "nativescript-wearos-sensors/internal/node";
import { SensorType } from "nativescript-wearos-sensors/internal/sensors/sensor-type";
import {CapabilityAdvertiserResultService} from "nativescript-wearos-sensors/internal/communication/capabilities/android/capability-advertiser-result-service.android";
import {buildFakeMessageEvent} from "~/tests/internal";

describe("Capability advertiser result service", () => {
    const node = new Node("node1", "node1", []);
    const capabilities = [ SensorType.ACCELEROMETER, SensorType.LOCATION, SensorType.HEART_RATE ];
    const protocol = {
        messagePath: "advertise-capabilities"
    };

    let resolutionCallback;
    let capabilityResultService: CapabilityAdvertiserResultService;

    beforeEach(() => {
        resolutionCallback = jasmine.createSpy("resolutionCallbackSpy");
        capabilityResultService = new CapabilityAdvertiserResultService();
        capabilityResultService.setProtocol(protocol);
        capabilityResultService.setResolutionCallbackForNode(node.id, resolutionCallback);
    })

    it("does nothing if receives a message with an unknown protocol", () => {
        const messageEvent = buildFakeMessageEvent(node.id, "unknownPath");
        capabilityResultService.onMessageReceived(messageEvent);

        expect(resolutionCallback).not.toHaveBeenCalled();
    });

    it("does nothing if receives a message without data payload", () => {
        const messageEvent = buildFakeMessageEvent(node.id, protocol.messagePath);
        capabilityResultService.onMessageReceived(messageEvent);

        expect(resolutionCallback).not.toHaveBeenCalled();
    });

    it("receives a message with capabilities and returns a capability result", () => {
        const messageEvent = buildFakeMessageEvent(
            node.id,
            protocol.messagePath,
            capabilities.join("#")
        );
        capabilityResultService.onMessageReceived(messageEvent);

        expect(resolutionCallback).toHaveBeenCalledWith({
            nodeId: node.id,
            capabilities: capabilities
        })
    });

    it("receives an empty message and returns a capability result without capabilities", () => {
        const messageEvent = buildFakeMessageEvent(node.id, protocol.messagePath, "");
        capabilityResultService.onMessageReceived(messageEvent);

        expect(resolutionCallback).toHaveBeenCalledWith({
            nodeId: node.id,
            capabilities: []
        })
    });
});

import { buildFakeMessageEvent, getFakeMessagingProtocol } from "../../index.spec";
import { TriAxialRecordMessagingService } from "nativescript-wearos-sensors/internal/sensors/triaxial/triaxial-record-messaging-service.android";
import { TriAxialSensorSample } from "nativescript-wearos-sensors/internal/sensors/triaxial/sample";
import { buildFakeEncodedMessage, getFakeTriAxialData } from "~/tests/internal/sensors/triaxial/index.spec";
import { SensorListenerManager } from "nativescript-wearos-sensors/internal/sensor-listener-manager";

describe("TriAxial record messaging service", () => {
    const nodeId = "testNode";
    const protocol = getFakeMessagingProtocol();

    let recordMessagingService: TriAxialRecordMessagingService;

    beforeEach(() => {
        recordMessagingService = new TriAxialRecordMessagingService(protocol);
        spyOn(SensorListenerManager.prototype, "notify").and.callFake(() => {});
        spyOn(recordMessagingService, "decodeSamples").and.callThrough();
    });

    it("does nothing when receives a messages with an unknown protocol", () => {
        const messageEvent = buildFakeMessageEvent(nodeId, "unknownProtocol");
        recordMessagingService.onMessageReceived(messageEvent);

        expect(recordMessagingService.decodeSamples).not.toHaveBeenCalled();
        expect(SensorListenerManager.prototype.notify).not.toHaveBeenCalled();
    });

    it("does nothing when receives a messages without data", () => {
        const messageEvent = buildFakeMessageEvent(nodeId, protocol.newRecordMessagePath);
        recordMessagingService.onMessageReceived(messageEvent);

        expect(recordMessagingService.decodeSamples).not.toHaveBeenCalled();
        expect(SensorListenerManager.prototype.notify).not.toHaveBeenCalled();
    });

    it("decodes the message data building a new record", () => {
        const expectedSamples: TriAxialSensorSample[] = [
            { ...getFakeTriAxialData() },
            { ...getFakeTriAxialData() },
        ];
        const messageEvent = buildFakeMessageEvent(
            nodeId,
            protocol.newRecordMessagePath,
            buildFakeEncodedMessage(expectedSamples)
        );

        const { samples } = recordMessagingService.decodeSamples(messageEvent);
        expect(samples.length).toBe(2);
        samples.forEach((sample, i) => {
            expect(sample.timestamp).toEqual(expectedSamples[i].timestamp);
            expect(sample.x).toBeCloseTo(expectedSamples[i].x, 6);
            expect(sample.y).toBeCloseTo(expectedSamples[i].y, 6);
            expect(sample.z).toBeCloseTo(expectedSamples[i].z, 6);
        })

    });

    it("receives a message, builds a record an notifies it", () => {
        const messageEvent = buildFakeMessageEvent(
            nodeId,
            protocol.newRecordMessagePath,
            buildFakeEncodedMessage([
                { ...getFakeTriAxialData() }
            ])
        );

        recordMessagingService.onMessageReceived(messageEvent);

        expect(recordMessagingService.decodeSamples).toHaveBeenCalledWith(messageEvent);
        expect(SensorListenerManager.prototype.notify).toHaveBeenCalled();
    });
})

import { buildFakeMessageEvent, getFakeMessagingProtocol } from "~/tests/internal/index.spec";
import { LocationSensorSample } from "nativescript-wearos-sensors/internal/sensors/location/sample";
import { LocationRecordMessagingService } from "nativescript-wearos-sensors/internal/sensors/location/android/record-messaging-service.android";
import { SensorType } from "nativescript-wearos-sensors/internal/sensors/sensor-type";

describe("Location record messaging service", () => {
    const nodeId = "testNode";
    const protocol = getFakeMessagingProtocol();

    it("decodes the message data building an array of location records", () => {
        const recordMessagingService = new LocationRecordMessagingService();
        const expectedSamples: LocationSensorSample[] = [
            { ...getFakeLocationData() },
            { ...getFakeLocationData() }
        ];

        const messageEvent = buildFakeMessageEvent(
            nodeId,
            protocol.newRecordMessagePath,
            buildFakeEncodedMessage(expectedSamples)
        );

        const decodedRecord = recordMessagingService.decodeSamples(messageEvent);
        expect(decodedRecord.type).toBe(SensorType.LOCATION);
        const { samples } = decodedRecord;
        samples.forEach((samples, i) => {
            expect(samples.latitude).toEqual(expectedSamples[i].latitude);
            expect(samples.longitude).toEqual(expectedSamples[i].longitude);
            expect(samples.altitude).toEqual(expectedSamples[i].altitude);
        })
    });
});

function getFakeLocationData() {
    return {
        timestamp: Date.now(),
        latitude: 39.9939752904,
        longitude: -0.0741332084749,
        altitude: 20,
    };
}

function buildFakeEncodedMessage(expectedSamples: LocationSensorSample[]) {
    const bytes = Array.create("byte", (4 + (32) * expectedSamples.length));
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = 0;
    }
    const buff = java.nio.ByteBuffer.wrap(bytes);
    buff.putInt(expectedSamples.length);
    expectedSamples.forEach((sample) => {
        buff.putDouble(sample.latitude);
        buff.putDouble(sample.longitude);
        buff.putDouble(sample.altitude);
        buff.putLong(sample.timestamp);
    })

    return bytes;
}

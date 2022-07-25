import { buildFakeMessageEvent, getFakeMessagingProtocol } from "~/tests/internal/index.spec";
import { HeartRateRecordMessagingService } from "nativescript-wearos-sensors/internal/sensors/heart-rate/android/record-messaging-service.android";
import { HeartRateSensorSample } from "nativescript-wearos-sensors/internal/sensors/heart-rate/sample";
import { SensorType } from "nativescript-wearos-sensors/internal/sensors/sensor-type";

describe("Heart rate record messaging service", () => {
    const nodeId = "testNode";
    const protocol = getFakeMessagingProtocol();

    it("decodes the message data building an array of heart rate records", () => {
        const recordMessagingService = new HeartRateRecordMessagingService();
        const expectedSamples: HeartRateSensorSample[] = [
            { ...getFakeHeartRateData() },
            { ...getFakeHeartRateData() }
        ];

        const messageEvent = buildFakeMessageEvent(
            nodeId,
            protocol.newRecordMessagePath,
            buildFakeEncodedMessage(expectedSamples)
        );

        const decodedRecord = recordMessagingService.decodeSamples(messageEvent);
        expect(decodedRecord.type).toBe(SensorType.HEART_RATE);
        const { samples } = decodedRecord;
        samples.forEach((sample, i) => {
            expect(sample.value).toEqual(expectedSamples[i].value);
        })
    });
});

function getFakeHeartRateData() {
    return {
        timestamp: Date.now(),
        value: Math.floor(Math.random() * 100),
    };
}

function buildFakeEncodedMessage(expectedSamples: HeartRateSensorSample[]) {
    const bytes = Array.create("byte", (4 + (12) * expectedSamples.length));
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = 0;
    }
    const buff = java.nio.ByteBuffer.wrap(bytes);
    buff.putInt(expectedSamples.length);
    expectedSamples.forEach((sample) => {
        buff.putInt(sample.value);
        buff.putLong(sample.timestamp);
    })

    return bytes;
}

import { buildFakeMessageEvent, getFakeMessagingProtocol } from "~/tests/internal/index.spec";
import { HeartRateRecordMessagingService } from "nativescript-wearos-sensors/internal/sensors/heart-rate/android/record-messaging-service.android";
import { HeartRateSensorRecord } from "nativescript-wearos-sensors/internal/sensors/heart-rate/record";
import { SensorType } from "nativescript-wearos-sensors/internal/sensors/sensor-type";

describe("Heart rate record messaging service", () => {
    const nodeId = "testNode";
    const protocol = getFakeMessagingProtocol();

    it("decodes the message data building an array of heart rate records", () => {
        const recordMessagingService = new HeartRateRecordMessagingService();
        const expectedRecords: HeartRateSensorRecord[] = [
            {
                deviceId: nodeId,
                ...getFakeHeartRateData(),
            },
            {
                deviceId: nodeId,
                ...getFakeHeartRateData(),
            }
        ];

        const messageEvent = buildFakeMessageEvent(
            nodeId,
            protocol.newRecordMessagePath,
            buildFakeEncodedMessage(expectedRecords)
        );

        const decodedRecord = recordMessagingService.decodeRecords(messageEvent);
        expect(decodedRecord.type).toBe(SensorType.HEART_RATE);
        const { records } = decodedRecord;
        records.forEach((record, i) => {
            expect(record.value).toEqual(expectedRecords[i].value);
        })
    });
});

function getFakeHeartRateData() {
    return {
        timestamp: new Date(),
        value: Math.floor(Math.random() * 100),
    };
}

function buildFakeEncodedMessage(expectedRecords: HeartRateSensorRecord[]) {
    const bytes = Array.create("byte", (4 + (12) * expectedRecords.length));
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = 0;
    }
    const buff = java.nio.ByteBuffer.wrap(bytes);
    buff.putInt(expectedRecords.length);
    expectedRecords.forEach((record) => {
        buff.putInt(record.value);
        buff.putLong(record.timestamp.getTime());
    })

    return bytes;
}

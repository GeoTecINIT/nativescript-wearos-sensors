import { buildFakeMessageEvent, getFakeMessagingProtocol } from "~/tests/internal/index.spec";
import { LocationSensorRecord } from "nativescript-wearos-sensors/internal/sensors/location/record";
import { LocationRecordMessagingService } from "nativescript-wearos-sensors/internal/sensors/location/android/record-messaging-service.android";
import { SensorType } from "nativescript-wearos-sensors/internal/sensors/sensor-type";

describe("Location record messaging service", () => {
    const nodeId = "testNode";
    const protocol = getFakeMessagingProtocol();

    it("decodes the message data building an array of location records", () => {
        const recordMessagingService = new LocationRecordMessagingService();
        const expectedRecords: LocationSensorRecord[] = [
            {
                deviceId: nodeId,
                ...getFakeLocationData(),
            },
            {
                deviceId: nodeId,
                ...getFakeLocationData(),
            }
        ];

        const messageEvent = buildFakeMessageEvent(
            nodeId,
            protocol.newRecordMessagePath,
            buildFakeEncodedMessage(expectedRecords)
        );

        const decodedRecord = recordMessagingService.decodeRecords(messageEvent);
        expect(decodedRecord.type).toBe(SensorType.LOCATION);
        const { records } = decodedRecord;
        records.forEach((record, i) => {
            expect(record.latitude).toEqual(expectedRecords[i].latitude);
            expect(record.longitude).toEqual(expectedRecords[i].longitude);
            expect(record.altitude).toEqual(expectedRecords[i].altitude);
        })
    });
});

function getFakeLocationData() {
    return {
        timestamp: new Date(),
        latitude: 39.9939752904,
        longitude: -0.0741332084749,
        altitude: 20,
    };
}

function buildFakeEncodedMessage(expectedRecords: LocationSensorRecord[]) {
    const bytes = Array.create("byte", (4 + (32) * expectedRecords.length));
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = 0;
    }
    const buff = java.nio.ByteBuffer.wrap(bytes);
    buff.putInt(expectedRecords.length);
    expectedRecords.forEach((record) => {
        buff.putDouble(record.latitude);
        buff.putDouble(record.longitude);
        buff.putDouble(record.altitude);
        buff.putLong(record.timestamp.getTime());
    })

    return bytes;
}

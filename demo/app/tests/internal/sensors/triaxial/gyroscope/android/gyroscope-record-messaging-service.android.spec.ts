import { buildFakeMessageEvent, getFakeMessagingProtocol } from "~/tests/internal/index.spec";
import { buildFakeEncodedMessage, getFakeTriAxialData } from "~/tests/internal/sensors/triaxial/index.spec";
import { GyroscopeRecordMessagingService } from "nativescript-wearos-sensors/internal/sensors/triaxial/gyroscope/android/record-messaging-service.android";
import { TriAxialSensorRecord } from "nativescript-wearos-sensors/internal/sensors/triaxial/record";
import { SensorType } from "nativescript-wearos-sensors/internal/sensors/sensor-type";

describe("Gyroscope record messaging service", () => {

    const nodeId = "testNode";
    const protocol = getFakeMessagingProtocol();

    it("decodes the message data building an array of gyroscope records", () => {
        const recordMessagingService = new GyroscopeRecordMessagingService();
        const expectedRecords: TriAxialSensorRecord[] = [
            {
                deviceId: nodeId,
                ...getFakeTriAxialData()
            },
            {
                deviceId: nodeId,
                ...getFakeTriAxialData()
            }
        ]
        const messageEvent = buildFakeMessageEvent(
            nodeId,
            protocol.newRecordMessagePath,
            buildFakeEncodedMessage(expectedRecords)
        )

        const decodedRecords = recordMessagingService.decodeRecords(messageEvent);
        expect(decodedRecords.type).toBe(SensorType.GYROSCOPE);
        expect(decodedRecords.records.length).toBe(2);
    });
});

import { AccelerometerRecordMessagingService } from "nativescript-wearos-sensors/internal/sensors/triaxial/accelerometer/android/record-messaging-service.android";
import { buildFakeEncodedMessage, getFakeTriAxialData } from "../../index";
import { buildFakeMessageEvent, getFakeMessagingProtocol } from "~/tests/internal";
import { TriAxialSensorRecord } from "nativescript-wearos-sensors/internal/sensors/triaxial/record";
import { SensorType } from "nativescript-wearos-sensors/internal/sensors/sensor-type";

describe("Accelerometer record messaging service", () => {

    const nodeId = "testNode";
    const protocol = getFakeMessagingProtocol();

    it("decodes the message data building an array of accelerometer records", () => {
        const recordMessagingService = new AccelerometerRecordMessagingService();
        const expectedRecords: TriAxialSensorRecord[] = [
            {
                deviceName: nodeId,
                ...getFakeTriAxialData()
            },
            {
                deviceName: nodeId,
                ...getFakeTriAxialData()
            }
        ]
        const messageEvent = buildFakeMessageEvent(
            nodeId,
            protocol.newRecordMessagePath,
            buildFakeEncodedMessage(expectedRecords)
        )

        const decodedRecords = recordMessagingService.decodeRecords(messageEvent);
        expect(decodedRecords.type).toBe(SensorType.ACCELEROMETER);
        expect(decodedRecords.records.length).toBe(2);
    });
});

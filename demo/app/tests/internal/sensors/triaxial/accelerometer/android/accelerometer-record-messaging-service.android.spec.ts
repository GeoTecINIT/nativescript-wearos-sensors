import { AccelerometerRecordMessagingService } from "nativescript-wearos-sensors/internal/sensors/triaxial/accelerometer/android/record-messaging-service.android";
import { buildFakeEncodedMessage, getFakeTriAxialData } from "../../index.spec";
import { buildFakeMessageEvent, getFakeMessagingProtocol } from "~/tests/internal/index.spec";
import { TriAxialSensorSample } from "nativescript-wearos-sensors/internal/sensors/triaxial/sample";
import { SensorType } from "nativescript-wearos-sensors/internal/sensors/sensor-type";

describe("Accelerometer record messaging service", () => {

    const nodeId = "testNode";
    const protocol = getFakeMessagingProtocol();

    it("decodes the message data building an array of accelerometer records", () => {
        const recordMessagingService = new AccelerometerRecordMessagingService();
        const expectedSamples: TriAxialSensorSample[] = [
            { ...getFakeTriAxialData() },
            { ...getFakeTriAxialData() }
        ]
        const messageEvent = buildFakeMessageEvent(
            nodeId,
            protocol.newRecordMessagePath,
            buildFakeEncodedMessage(expectedSamples)
        )

        const decodedRecord = recordMessagingService.decodeSamples(messageEvent);
        expect(decodedRecord.type).toBe(SensorType.ACCELEROMETER);
        expect(decodedRecord.samples.length).toBe(2);
    });
});

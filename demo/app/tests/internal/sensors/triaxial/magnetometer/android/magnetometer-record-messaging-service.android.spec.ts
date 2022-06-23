import { buildFakeMessageEvent, getFakeMessagingProtocol } from "~/tests/internal/index.spec";
import { buildFakeEncodedMessage, getFakeTriAxialData } from "~/tests/internal/sensors/triaxial/index.spec";
import { MagnetometerRecordMessagingService } from "nativescript-wearos-sensors/internal/sensors/triaxial/magnetometer/android/record-messaging-service.android";
import { TriAxialSensorSample } from "nativescript-wearos-sensors/internal/sensors/triaxial/sample";
import { SensorType } from "nativescript-wearos-sensors/internal/sensors/sensor-type";

describe("Magnetometer record messaging service", () => {

    const nodeId = "testNode";
    const protocol = getFakeMessagingProtocol();

    it("decodes the message data building an array of gyroscope records", () => {
        const recordMessagingService = new MagnetometerRecordMessagingService();
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
        expect(decodedRecord.type).toBe(SensorType.MAGNETOMETER);
        expect(decodedRecord.samples.length).toBe(2);
    });
});

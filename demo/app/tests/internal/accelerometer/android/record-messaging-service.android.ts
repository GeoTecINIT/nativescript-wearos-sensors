import { buildFakeMessageEvent, getFakeMessagingProtocol } from "../..";
import { AccelerometerSensorRecord } from "nativescript-wearos-sensors/internal/accelerometer/record";
import { AccelerometerRecordMessagingService } from "nativescript-wearos-sensors/internal/accelerometer/android/record-messaging-service.android";

describe("Accelerometer record messaging service", () => {
    const nodeId = "testNode";
    const protocol = getFakeMessagingProtocol();

    let callbackManager;
    let recordMessagingService: AccelerometerRecordMessagingService;

    beforeEach(() => {
        callbackManager = jasmine.createSpyObj("callbackManagerSpy", ['notifyAll']);
        recordMessagingService = new AccelerometerRecordMessagingService();
        recordMessagingService.setProtocol(protocol);
        recordMessagingService.setCallbackManager(callbackManager);
        spyOn(recordMessagingService, "decodeRecords").and.callThrough();
    });

    it("does nothing when receives a messages with an unknown protocol", () => {
        const messageEvent = buildFakeMessageEvent(nodeId, "unknownProtocol");
        recordMessagingService.onMessageReceived(messageEvent);

        expect(recordMessagingService.decodeRecords).not.toHaveBeenCalled();
        expect(callbackManager.notifyAll).not.toHaveBeenCalled();
    });

    it("does nothing when receives a messages without data", () => {
        const messageEvent = buildFakeMessageEvent(nodeId, protocol.newRecordMessagePath);
        recordMessagingService.onMessageReceived(messageEvent);

        expect(recordMessagingService.decodeRecords).not.toHaveBeenCalled();
        expect(callbackManager.notifyAll).not.toHaveBeenCalled();
    });

    it("decodes the message data building a new record", () => {
        const expectedRecords: AccelerometerSensorRecord[] = [
            {
                deviceName: nodeId,
                ...getFakeAccelerometerData()
            },
            {
                deviceName: nodeId,
                ...getFakeAccelerometerData()
            },
        ];
        const messageEvent = buildFakeMessageEvent(
            nodeId,
            protocol.newRecordMessagePath,
            buildFakeEncodedMessage(expectedRecords)
        );

        const records = recordMessagingService.decodeRecords(messageEvent);
        expect(records.length).toBe(2);
        records.forEach((record, i) => {
            expect(record.deviceName).toEqual(expectedRecords[i].deviceName);
            expect(record.timestamp).toEqual(expectedRecords[i].timestamp);
            expect(record.x).toBeCloseTo(expectedRecords[i].x, 6);
            expect(record.y).toBeCloseTo(expectedRecords[i].y, 6);
            expect(record.z).toBeCloseTo(expectedRecords[i].z, 6);
        })

    });

    it("receives a message, builds a record an notifies it", () => {
        const messageEvent = buildFakeMessageEvent(
            nodeId,
            protocol.newRecordMessagePath,
            buildFakeEncodedMessage([
                {
                    deviceName: nodeId,
                    ...getFakeAccelerometerData()
                }
            ])
        );

        recordMessagingService.onMessageReceived(messageEvent);

        expect(recordMessagingService.decodeRecords).toHaveBeenCalledWith(messageEvent);
        expect(callbackManager.notifyAll).toHaveBeenCalled();
    });
})

function getFakeAccelerometerData() {
    return {
        timestamp: new Date(),
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
    };
}

function buildFakeEncodedMessage(expectedRecords: AccelerometerSensorRecord[]) {
    const bytes = Array.create("byte", (4 + (20) * expectedRecords.length));
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = 0;
    }
    const buff = java.nio.ByteBuffer.wrap(bytes);
    buff.putInt(expectedRecords.length);
    expectedRecords.forEach((record) => {
        buff.putFloat(record.x);
        buff.putFloat(record.y);
        buff.putFloat(record.z);
        buff.putLong(record.timestamp.getTime());
    })

    return bytes;
}

import { buildFakeMessageEvent, getFakeMessagingProtocol } from "../..";
import { AccelerometerRecordMessagingListener } from "nativescript-wearos-sensors/internal/accelerometer/android/record-messaging-listener.android";
import { AccelerometerSensorRecord } from "nativescript-wearos-sensors/internal/accelerometer/record";

describe("Accelerometer record messaging listener", () => {
    const nodeId = "testNode";
    const protocol = getFakeMessagingProtocol();

    let callbackManager;
    let recordMessagingListener: AccelerometerRecordMessagingListener;

    beforeEach(() => {
        callbackManager = jasmine.createSpyObj("callbackManagerSpy", ['notifyAll']);
        recordMessagingListener = new AccelerometerRecordMessagingListener(
            protocol,
            callbackManager
        );
        spyOn(recordMessagingListener, "decodeRecord").and.callThrough();
    });

    it("does nothing when receives a messages with an unknown protocol", () => {
        const messageEvent = buildFakeMessageEvent(nodeId, "unknownProtocol");
        recordMessagingListener.onMessageReceived(messageEvent);

        expect(recordMessagingListener.decodeRecord).not.toHaveBeenCalled();
        expect(callbackManager.notifyAll).not.toHaveBeenCalled();
    });

    it("does nothing when receives a messages without data", () => {
        const messageEvent = buildFakeMessageEvent(nodeId, protocol.newRecordMessagePath);
        recordMessagingListener.onMessageReceived(messageEvent);

        expect(recordMessagingListener.decodeRecord).not.toHaveBeenCalled();
        expect(callbackManager.notifyAll).not.toHaveBeenCalled();
    });

    it("decodes the message data building a new record", () => {
        const fakeAccelerometerData = getFakeAccelerometerData();
        const expectedRecord: AccelerometerSensorRecord = {
            deviceName: nodeId,
            ...fakeAccelerometerData
        };
        const messageEvent = buildFakeMessageEvent(
            nodeId,
            protocol.newRecordMessagePath,
            buildFakeEncodedMessage(fakeAccelerometerData)
        );

        const record = recordMessagingListener.decodeRecord(messageEvent);
        expect(record.deviceName).toEqual(expectedRecord.deviceName);
        expect(record.timestamp).toEqual(expectedRecord.timestamp);
        expect(record.x).toBeCloseTo(expectedRecord.x, 6);
        expect(record.y).toBeCloseTo(expectedRecord.y, 6);
        expect(record.z).toBeCloseTo(expectedRecord.z, 6);
    });

    it("receives a message, builds a record an notifies it", () => {
        const fakeAccelerometerData = getFakeAccelerometerData();
        const messageEvent = buildFakeMessageEvent(
            nodeId,
            protocol.newRecordMessagePath,
            buildFakeEncodedMessage(fakeAccelerometerData)
        );

        recordMessagingListener.onMessageReceived(messageEvent);

        expect(recordMessagingListener.decodeRecord).toHaveBeenCalledWith(messageEvent);
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

function buildFakeEncodedMessage(fakeAccelerometerData) {
    const bytes = Array.create("byte", 20);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = 0;
    }
    const buff = java.nio.ByteBuffer.wrap(bytes);
    buff.putFloat(fakeAccelerometerData.x);
    buff.putFloat(fakeAccelerometerData.y);
    buff.putFloat(fakeAccelerometerData.z);
    buff.putLong(fakeAccelerometerData.timestamp.getTime());
    return bytes;
}

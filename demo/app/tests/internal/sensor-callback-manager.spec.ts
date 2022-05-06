import { SensorCallbackManager } from "nativescript-wearos-sensors/internal/sensor-callback-manager";
import { SensorRecord, SensorRecords } from "nativescript-wearos-sensors/internal/sensors/sensor-record";
import { buildFakeSensorRecords } from "~/tests/internal/index.spec";
import { SensorType } from "nativescript-wearos-sensors/internal/sensors/sensor-type";

describe("Sensor callback manager", () => {
    const callbackManager = new SensorCallbackManager();
    const sensorTypeA = SensorType.ACCELEROMETER;
    const sensorTypeB = SensorType.LOCATION;

    const sensorRecordA1: SensorRecord = {
        deviceId: "test",
        timestamp: new Date()
    };
    const sensorRecordA2: SensorRecord = {
        deviceId: "test",
        timestamp: new Date()
    };
    const sensorRecordB1: SensorRecord = {
        deviceId: "test",
        timestamp: new Date()
    };
    const noNotificationTimeout = 100;

    it("adds a callback for an event and return its id", () => {
        const callback = (records) => null;
        const callbackId = callbackManager.add(callback, sensorTypeA);
        expect(callbackId).toBeGreaterThanOrEqual(0);
    });

    it("notifies all registered callbacks of a specific event for sensor updates", async () => {
        const toBeNotified = listenSensorUpdates(callbackManager, sensorTypeA);
        const notToBeNotified = failOnListenSensorUpdates(
            callbackManager,
            sensorTypeB,
            noNotificationTimeout,
            (callbackId) => null
        );

        const sensorRecords = buildFakeSensorRecords(sensorTypeA,[sensorRecordA1, sensorRecordA2]);
        callbackManager.notifyAll(
            sensorRecords
        );

        const sensorUpdates = await toBeNotified;
        expect(sensorUpdates).toEqual(sensorRecords);
        await notToBeNotified;
    });

    it("removes a callback given an existent callback id", async () => {
        const notToBeNotified = failOnListenSensorUpdates(
            callbackManager,
            sensorTypeA,
            noNotificationTimeout,
            (callbackId) => callbackManager.remove(callbackId),
        );

        callbackManager.notifyAll(
            buildFakeSensorRecords(sensorTypeA,[sensorRecordA1, sensorRecordA2])
        );
        await notToBeNotified;
    });

    it("removes a specific callback, but others can listen updates", async () => {
        const notToBeNotified = failOnListenSensorUpdates(
            callbackManager,
            sensorTypeB,
            noNotificationTimeout,
            (callbackId) => callbackManager.remove(callbackId),
        );
        const toBeNotified = listenSensorUpdates(callbackManager, sensorTypeA);

        await notToBeNotified;
        const sensorRecords = buildFakeSensorRecords(sensorTypeA,[sensorRecordA1, sensorRecordA2]);
        callbackManager.notifyAll(sensorRecords);
        callbackManager.notifyAll(
            buildFakeSensorRecords(sensorTypeB, [sensorRecordB1])
        );

        const sensorUpdates = await toBeNotified;
        expect(sensorUpdates).toBe(sensorRecords);
    });

    it("removes all registered callbacks for a specific event, while others can listen updates", async () => {
        const notToBeNotified1 = failOnListenSensorUpdates(
            callbackManager,
            sensorTypeA,
            noNotificationTimeout,
            (callbackId) => null
        );
        const notToBeNotified2 = failOnListenSensorUpdates(
            callbackManager,
            sensorTypeA,
            noNotificationTimeout,
            (callbackId) => null
        );
        const toBeNotified = listenSensorUpdates(callbackManager, sensorTypeB);

        callbackManager.removeAllForEvent(sensorTypeA);
        callbackManager.notifyAll(
            buildFakeSensorRecords(sensorTypeA,[sensorRecordA1, sensorRecordA2])
        );
        const sensorRecords = buildFakeSensorRecords(sensorTypeB,[sensorRecordB1]);
        callbackManager.notifyAll(sensorRecords);

        const sensorUpdates = await toBeNotified;
        expect(sensorUpdates).toBe(sensorRecords)
    })

    it("removes all registered callbacks, so no one is notified", async () => {
        const notToBeNotified1 = failOnListenSensorUpdates(
            callbackManager,
            sensorTypeA,
            noNotificationTimeout,
            (callbackId) => null
        );
        const notToBeNotified2 = failOnListenSensorUpdates(
            callbackManager,
            sensorTypeB,
            noNotificationTimeout,
            (callbackId) => null
        );

        callbackManager.removeAll();
        callbackManager.notifyAll(
            buildFakeSensorRecords(sensorTypeA,[sensorRecordA1, sensorRecordA2])
        );

        const success = await Promise.all([notToBeNotified1, notToBeNotified2]);
        expect(success.length).toBe(2);
    });

    afterEach(() => callbackManager.removeAll());
});

function listenSensorUpdates(
    callbackManager: SensorCallbackManager,
    eventName: string
): Promise<SensorRecords<any>> {
    return new Promise((resolve) =>
        callbackManager.add(sensorRecords => resolve(sensorRecords), eventName))
}

function failOnListenSensorUpdates(
    callbackManager: SensorCallbackManager,
    eventName: string,
    timeout: number,
    onAdd: (number) => void
): Promise<void> {
    return new Promise((resolve, reject) => {
        const listenerId = callbackManager.add((_) =>
            reject("Callback should not be called"),
            eventName
        );
        setTimeout(() => resolve(), timeout);
        onAdd(listenerId);
    });
}

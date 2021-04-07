import { SensorCallbackManager } from "nativescript-wearos-sensors/internal/sensor-callback-manager";
import { SensorRecord } from "nativescript-wearos-sensors/internal/sensor-record";

describe("Sensor callback manager", () => {
    const callbackManager = new SensorCallbackManager<SensorRecord>("testEvent");
    const sensorRecord: SensorRecord = {
        deviceName: "test",
        timestamp: new Date()
    };
    const noNotificationTimeout = 100;

    it("adds a callback and return its id", () => {
        const callback = (record) => null;
        const callbackId = callbackManager.add(callback);
        expect(callbackId).toBeGreaterThanOrEqual(0);
    });

    it("notifies all registered callbacks for sensor updates", async () => {
        const callback1 = listenSensorUpdates(callbackManager);
        const callback2 = listenSensorUpdates(callbackManager);
        callbackManager.notifyAll(sensorRecord);
        const sensorUpdates = await Promise.all([callback1, callback2]);
        sensorUpdates.forEach((sensorUpdate) => {
            expect(sensorUpdate).toEqual(sensorRecord);
        })
    });

    it("removes a callback given an existent callback id", async () => {
        const notToBeNotified = failOnActivityChange(
            callbackManager,
            noNotificationTimeout,
            (callbackId) => callbackManager.remove(callbackId),
        )
        callbackManager.notifyAll(sensorRecord);
        await notToBeNotified;
    });

    it("removes a specific callback, but others can listen updates", async () => {
        const notToBeNotified = failOnActivityChange(
            callbackManager,
            noNotificationTimeout,
            (callbackId) => callbackManager.remove(callbackId),
        )
        const toBeNotified = listenSensorUpdates(callbackManager);
        callbackManager.notifyAll(sensorRecord);
        const success = await Promise.all([notToBeNotified, toBeNotified]);
        expect(success.length).toBe(2);
    });

    it("removes all registered callbacks, so no one is notified", async () => {
        const notToBeNotified1 = failOnActivityChange(
            callbackManager,
            noNotificationTimeout,
            (callbackId) => null
        );
        const notToBeNotified2 = failOnActivityChange(
            callbackManager,
            noNotificationTimeout,
            (callbackId) => null
        );
        callbackManager.removeAll();
        callbackManager.notifyAll(sensorRecord);
        const success = await Promise.all([notToBeNotified1, notToBeNotified2]);
        expect(success.length).toBe(2);
    });

    afterEach(() => callbackManager.removeAll());
});

function listenSensorUpdates(
    callbackManager: SensorCallbackManager<SensorRecord>
): Promise<SensorRecord> {
    return new Promise((resolve) =>
        callbackManager.add(sensorRecord => resolve(sensorRecord)))
}

function failOnActivityChange(
    callbackManager: SensorCallbackManager<SensorRecord>,
    timeout: number,
    onAdd: (number) => void
): Promise<void> {
    return new Promise((resolve, reject) => {
        const listenerId = callbackManager.add((_) =>
            reject("Callback should not be called after removal")
        );
        setTimeout(() => resolve(), timeout);
        onAdd(listenerId);
    });
}

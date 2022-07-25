import { ListenerFilter, SensorListenerManager } from "nativescript-wearos-sensors/internal/sensor-listener-manager";
import { SensorRecord } from "nativescript-wearos-sensors/internal/sensors/sensor-record";
import { buildFakeSensorRecords } from "~/tests/internal/index.spec";
import { SensorType } from "nativescript-wearos-sensors/internal/sensors/sensor-type";
import { SensorSample } from "nativescript-wearos-sensors/internal/sensors/sample";
import { Node } from "nativescript-wearos-sensors/internal/node";

describe("Sensor listener manager", () => {
    const nodeA = new Node("testNodeA", "testNodeA");
    const nodeB = new Node("testNodeB", "testNodeB");
    const accelerometerType = SensorType.ACCELEROMETER;
    const locationType = SensorType.LOCATION;

    const sensorRecord1: SensorSample = {
        timestamp: Date.now()
    };
    const sensorRecord2: SensorSample = {
        timestamp: Date.now()
    };

    let listenerManager: SensorListenerManager;

    beforeEach(() => {
        listenerManager = new SensorListenerManager();
    })

    it("adds a listener and return its id", () => {
        const listener = (_) => null;
        const listenerId = listenerManager.add(listener, {});
        expect(listenerId).toBeGreaterThanOrEqual(0);
    });

    it("notifies the listeners registered for a specific sensor type", async() => {
        const toBeNotified = listenFilteredSensorUpdates(listenerManager, {
            sensors: [accelerometerType]
        });

        const notToBeNotified = failOnListenFilteredSensorUpdates(listenerManager, {
            sensors: [locationType]
        });

        const sensorRecord = buildFakeSensorRecords(accelerometerType, nodeA.id, [sensorRecord1, sensorRecord2]);
        listenerManager.notify(sensorRecord);

        await expectAsync(toBeNotified).toBeResolvedTo(sensorRecord);
        await expectAsync(notToBeNotified).toBeResolved();
    });

    it("notifies the listeners registered for a specific node", async() => {
        const toBeNotified = listenFilteredSensorUpdates(listenerManager, {
            nodes: [nodeA]
        });

        const notToBeNotified = failOnListenFilteredSensorUpdates(listenerManager, {
            nodes: [nodeB]
        });

        const sensorRecord = buildFakeSensorRecords(accelerometerType, nodeA.id, [sensorRecord1, sensorRecord2]);
        listenerManager.notify(sensorRecord);

        await expectAsync(toBeNotified).toBeResolvedTo(sensorRecord);
        await expectAsync(notToBeNotified).toBeResolved();
    });

    it("notifies all listeners registered for a specific node and sensor type", async() => {
        const globalListener = listenFilteredSensorUpdates(listenerManager, {});
        const toBeNotified = listenFilteredSensorUpdates(listenerManager, {
            nodes: [nodeA],
            sensors: [accelerometerType]
        });

        const notToBeNotified = failOnListenFilteredSensorUpdates(listenerManager, {
            nodes: [nodeA],
            sensors: [locationType]
        });
        const notToBeNotified2= failOnListenFilteredSensorUpdates(listenerManager, {
            nodes: [nodeB],
            sensors: [accelerometerType]
        });

        const sensorRecord = buildFakeSensorRecords(accelerometerType, nodeA.id, [sensorRecord1, sensorRecord2]);
        listenerManager.notify(sensorRecord);

        await expectAsync(globalListener).toBeResolvedTo(sensorRecord);
        await expectAsync(toBeNotified).toBeResolvedTo(sensorRecord);
        await expectAsync(notToBeNotified).toBeResolved();
        await expectAsync(notToBeNotified2).toBeResolved();
    });

    it("notifies all registered listeners for their specific filtering requirements", () => {
        const listenerGlobal = listenFilteredSensorUpdatesWithSpy(listenerManager, {});
        const listenerAccLocA = listenFilteredSensorUpdatesWithSpy(listenerManager, {
            nodes: [nodeA],
            sensors: [accelerometerType, locationType]
        });

        const listenerAccB = listenFilteredSensorUpdatesWithSpy(listenerManager, {
            nodes: [nodeB],
            sensors: [accelerometerType]
        });

        const sensorRecordAccA = buildFakeSensorRecords(accelerometerType, nodeA.id, [sensorRecord1, sensorRecord2]);
        const sensorRecordAccB = buildFakeSensorRecords(accelerometerType, nodeB.id, [sensorRecord1, sensorRecord2]);
        const sensorRecordLocA = buildFakeSensorRecords(locationType, nodeA.id, [sensorRecord1, sensorRecord2]);
        const sensorRecordLocB = buildFakeSensorRecords(locationType, nodeB.id, [sensorRecord1, sensorRecord2]);

        listenerManager.notify(sensorRecordAccA);
        listenerManager.notify(sensorRecordAccB);
        listenerManager.notify(sensorRecordLocA);
        listenerManager.notify(sensorRecordLocB);

        expect(listenerGlobal.calls.allArgs()).toEqual([[sensorRecordAccA], [sensorRecordAccB], [sensorRecordLocA], [sensorRecordLocB]]);
        expect(listenerAccLocA.calls.allArgs()).toEqual([[sensorRecordAccA], [sensorRecordLocA]]);
        expect(listenerAccB.calls.allArgs()).toEqual([[sensorRecordAccB]]);
    });
});

function listenFilteredSensorUpdates(
    listenerManager: SensorListenerManager,
    filters: ListenerFilter
): Promise<SensorRecord<any>> {
    return new Promise((resolve) => listenerManager.add(sensorRecords => resolve(sensorRecords), filters));
}

function listenFilteredSensorUpdatesWithSpy(
    listenerManager: SensorListenerManager,
    filters: ListenerFilter
) {
    const listener = jasmine.createSpy();
    listenerManager.add((sensorRecords) => listener(sensorRecords), filters);
    return listener;
}

function failOnListenFilteredSensorUpdates(
    listenerManager: SensorListenerManager,
    filters: ListenerFilter,
    timeout: number = 100,
): Promise<void> {
    return new Promise((resolve, reject) => {
        listenerManager.add(() => reject("Listener should not be called"), filters);
        setTimeout(resolve, timeout);
    })
}

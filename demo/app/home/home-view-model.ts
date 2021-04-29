import {
    Observable,
    EventData,
    ListPicker
} from "@nativescript/core";

import { getSensorCollector } from "nativescript-wearos-sensors/internal/sensors";
import { CollectorManager } from "nativescript-wearos-sensors/internal/collector-manager";
import { SensorType } from "nativescript-wearos-sensors/internal/sensors/sensor-type";
import { TriAxialSensorRecord } from "nativescript-wearos-sensors/internal/sensors/triaxial/record";
import {LocationSensorRecord} from "nativescript-wearos-sensors/internal/sensors/location/record";

export class HomeViewModel extends Observable {

    private collector: CollectorManager;
    private sensors: SensorType[] = [
        SensorType.ACCELEROMETER,
        SensorType.GYROSCOPE,
        SensorType.MAGNETOMETER,
        SensorType.LOCATION
    ];
    private selectedSensor: SensorType;

    private isDeviceReady: boolean;
    private readyResponse: string;
    private waitingForIsReadyResponse: boolean;

    private needToPrepare: boolean;
    private prepareResponse: string;
    private waitingForPrepareResponse: boolean;

    private started: boolean;

    private receivedRecords: TriAxialReceivedRecords | LocationReceivedRecords;

    private listenerId: number;

    constructor() {
        super();
        this.collector = getSensorCollector(SensorType.ACCELEROMETER);
        this.clearStatus();
    }

    onListPickerLoaded(args) {
        const listPicker = args.object;
        listPicker.on('selectedIndexChange', (data: EventData) => {
            const picker = data.object as ListPicker;
            this.collector = getSensorCollector(this.sensors[picker.selectedIndex]);
            this.clearStatus();
        });
    }

    onIsReadyTap() {
        this.updateWaitingIndicator(true, "isReady");
        this.collector.isReady().then((ready) => {
            console.log(`${this.selectedSensor} isReady response: ${ready}`);
            const readyResponse = `${this.selectedSensor} is ${ready ? "ready" : "not ready"}`;
            this.updateWaitingIndicator(false, "isReady");
            this.updateIsReadyStatus(ready, readyResponse);
            this.updateNeedToPrepareStatus(!ready)
        });
    }

    onPrepareTap() {
        this.updateWaitingIndicator(true, "prepare");
        this.collector.prepare().then((prepareErrors) => {
            console.log(`${this.selectedSensor} prepare response: ${JSON.stringify(prepareErrors)}`);
            const needToPrepare = prepareErrors.length > 0;
            const prepareMessage =`${this.selectedSensor} has ${!needToPrepare ? "been prepared": "not been prepared"}`;
            this.updateWaitingIndicator(false, "prepare");
            this.updateNeedToPrepareStatus(needToPrepare, prepareMessage);
            this.updateIsReadyStatus(!needToPrepare, `${this.selectedSensor} is ${!needToPrepare ? "ready" : "not ready"}`);
        });
    }

    onStartTap() {
        this.listenerId = this.collector.listenSensorUpdates((records) => {
            console.log(JSON.stringify(records));
            const sensorRecords = records.records
            const recordsInfo = {
                type: records.type,
                batchSize: sensorRecords.length,
            };
            this.receivedRecords = records.type === SensorType.LOCATION
                ? { ...recordsInfo, record: sensorRecords[0]}
                : { ...recordsInfo, first: sensorRecords[0], last: sensorRecords[sensorRecords.length - 1]};
            this.notifyPropertyChange("receivedRecords", this.receivedRecords);
        });
        this.collector.startCollecting();
        this.updateStartedStatus(true);
    }

    onStopTap() {
        this.collector.stopCollecting();
        this.collector.stopListenSensorUpdates(this.listenerId);
        this.updateStartedStatus(false);
    }

    onClearNodesTap() {
        this.collector.clearNodes();
        this.clearStatus();
    }

    private updateIsReadyStatus(ready: boolean, message?: string) {
        this.isDeviceReady = ready;
        this.readyResponse = message;
        this.notifyPropertyChange("readyResponse", this.readyResponse);
        this.notifyPropertyChange("isDeviceReady", this.isDeviceReady);
    }

    private updateNeedToPrepareStatus(needToPrepare: boolean, message?: string) {
        this.needToPrepare = needToPrepare;
        this.prepareResponse = message;

        this.notifyPropertyChange("prepareResponse", this.prepareResponse);
        this.notifyPropertyChange("needToPrepare", this.needToPrepare);
    }

    private updateWaitingIndicator(waiting: boolean, indicator: "isReady" | "prepare") {
        if (indicator === "isReady") {
            this.waitingForIsReadyResponse = waiting;
            this.notifyPropertyChange("waitingForIsReadyResponse", this.waitingForIsReadyResponse);
        } else {
            this.waitingForPrepareResponse = waiting;
            this.notifyPropertyChange("waitingForPrepareResponse", this.waitingForPrepareResponse);
        }
    }

    private updateStartedStatus(started: boolean) {
        this.started = started;
        this.notifyPropertyChange("started", this.started);
    }

    private clearStatus() {
        this.receivedRecords = undefined;

        this.updateIsReadyStatus(false);
        this.updateNeedToPrepareStatus(false);
        this.updateStartedStatus(false);
    }
}

interface ReceivedRecords {
    type: SensorType,
    batchSize: number,
}

interface TriAxialReceivedRecords extends ReceivedRecords {
    first: TriAxialSensorRecord,
    last: TriAxialSensorRecord,
}

interface LocationReceivedRecords extends ReceivedRecords {
    record: LocationSensorRecord,
}

const fakeRecord = {
    type: SensorType.ACCELEROMETER,
    batchSize: 50,
    first: {
        timestamp: new Date(), x: 0, y: 9.81000041966167, z: 0
    },
    last: {
        timestamp: new Date(), x: 0, y: 9.81000041966167, z: 0
    }
}

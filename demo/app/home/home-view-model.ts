import { Observable } from "tns-core-modules/data/observable";
import { getAccelerometerCollector } from "../../../src/internal/accelerometer";
import { CollectorManager } from "../../../src/internal/collector-manager";

export class HomeViewModel extends Observable {

    private accelerometerCollector: CollectorManager;

    constructor() {
        super();
        this.accelerometerCollector = getAccelerometerCollector();
        this.accelerometerCollector.listenSensorUpdates((accelerometerRecord) => {
            console.log(JSON.stringify(accelerometerRecord));
        });
    }

    onSendIsReadyTap() {
        this.accelerometerCollector.isReady().then((ready) => {
            console.log("isReadyResponse: " + ready);
        })
    }

    onSendPrepareTap() {
        this.accelerometerCollector.prepare().then((prepareErrors) => {
            console.log(`prepareResponse, errors: ${JSON.stringify(prepareErrors)}`);
        })
    }

    onSendStartTap() {
        this.accelerometerCollector.startCollecting();
    }

    onSendStopTap() {
        this.accelerometerCollector.stopCollecting();
    }
}

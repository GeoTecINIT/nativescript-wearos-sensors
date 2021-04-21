import { Observable } from "tns-core-modules/data/observable";
import { getAccelerometerCollector } from "../../../src/internal/sensors/triaxial/accelerometer";
import { CollectorManager } from "../../../src/internal/collector-manager";
import { getGyroscopeCollector } from "../../../src/internal/sensors/triaxial/gyroscope";

export class HomeViewModel extends Observable {

    private accelerometerCollector: CollectorManager;
    private gyroscopeCollector: CollectorManager;

    constructor() {
        super();
        this.accelerometerCollector = getAccelerometerCollector();
        this.gyroscopeCollector = getGyroscopeCollector();
        this.accelerometerCollector.listenSensorUpdates((accelerometerRecords) => {
            console.log(JSON.stringify(accelerometerRecords));
        });
        this.gyroscopeCollector.listenSensorUpdates((gyroscopeRecords) => {
            console.log(JSON.stringify(gyroscopeRecords));
        });
    }

    onAccIsReadyTap() {
        this.accelerometerCollector.isReady().then((ready) => {
            console.log("acc isReadyResponse: " + ready);
        })
    }

    onAccPrepareTap() {
        this.accelerometerCollector.prepare().then((prepareErrors) => {
            console.log(`acc prepareResponse, errors: ${JSON.stringify(prepareErrors)}`);
        })
    }

    onAccStartTap() {
        this.accelerometerCollector.startCollecting();
    }

    onAccStopTap() {
        this.accelerometerCollector.stopCollecting();
    }

    onAccClearNodesTap() {
        this.accelerometerCollector.clearNodes();
    }

    onGyroIsReadyTap() {
        this.gyroscopeCollector.isReady().then((ready) => {
            console.log("gyro isReadyResponse: " + ready);
        })
    }

    onGyroPrepareTap() {
        this.gyroscopeCollector.prepare().then((prepareErrors) => {
            console.log(`gyro prepareResponse, errors: ${JSON.stringify(prepareErrors)}`);
        })
    }

    onGyroStartTap() {
        this.gyroscopeCollector.startCollecting();
    }

    onGyroStopTap() {
        this.gyroscopeCollector.stopCollecting();
    }

    onGyroClearNodesTap() {
        this.gyroscopeCollector.clearNodes();
    }
}

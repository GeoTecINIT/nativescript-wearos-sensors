import { Button, Color, EventData, Observable, Repeater } from "@nativescript/core";
import { getLogger } from "~/home/logger/logger-view-model";
import { ValueList } from "nativescript-drop-down";
import { Node } from "nativescript-wearos-sensors/node";
import { CollectorManager, PrepareError, NativeSensorDelay } from "nativescript-wearos-sensors/collection";
import { getSensorCollector, SensorType } from "nativescript-wearos-sensors/sensors";
import { wearosSensors } from "nativescript-wearos-sensors";

export class DeviceViewModel extends Observable {
    private logger;
    private status = {
        availableInDevice: "available in device",
        waitingForResponse: "waiting for response...",
        notReady:"not ready",
        ready: "ready for listening",
        listening: "listening for records..."
    }

    private bgColors = {
        availableInDevice: new Color("#8c8c8c"),
        waitingForResponse: new Color("#a8a8a8"),
        notReady: new Color("#fffa6e"),
        ready: new Color("#90EE90"),
        listening: new Color("#90EE90"),
    }

    private sensorDescription: SensorDescription[];

    private repeater: Repeater;

    private customSensorInterval: number;
    private sensorIntervals = new ValueList([
        { value: NativeSensorDelay.NORMAL, display: "NORMAL" },
        { value: NativeSensorDelay.UI, display: "UI" },
        { value: NativeSensorDelay.GAME, display: "GAME" },
        { value: NativeSensorDelay.FASTEST, display: "FASTEST" }
    ]);
    private selectedDelayIndex = 0;

    private batchSize = 50;

    private listeners = new Map<SensorType, number>();

    constructor(
        private node: Node
    ) {
        super();
        this.logger = getLogger();
        this.sensorDescription = this.node.capabilities.map((sensor) => {
            return {
                parent: this,
                collector: getSensorCollector(sensor),
                sensor: sensor,
                status: {
                    id: Status.AVAILABLE_IN_DEVICE,
                    message: this.status["availableInDevice"],
                    iconColorBg: this.bgColors["availableInDevice"]
                },
                icon: iconForSensor(sensor),
            };
        });
    }

    setRepeater(repeater) {
        this.repeater = repeater;
    }

    onIsReadyTap(args: EventData) {
        const sensorDescription = <SensorDescription>(<Button>args.object).bindingContext;
        const parent = sensorDescription.parent;

        parent.handleOnIsReadyTap(sensorDescription);
    }

    onPrepareTap(args: EventData) {
        const sensorDescription = (<Button>args.object).bindingContext;
        const parent = sensorDescription.parent;

        parent.handleOnPrepareTap(sensorDescription);
    }

    onStartTap(args: EventData){
        const sensorDescription = (<Button>args.object).bindingContext;
        const parent = sensorDescription.parent;

        parent.handleOnStartTap(sensorDescription);
    }

    onStopTap(args: EventData) {
        const sensorDescription = (<Button>args.object).bindingContext;
        const parent = sensorDescription.parent;

        parent.handleOnStopTap(sensorDescription);
    }

    onStoreData() {
        wearosSensors.emitEvent("storeCollectedData", {
            deviceId: this.node.id
        });
    }

    onClearData() {
        wearosSensors.emitEvent("clearCollectedData");
    }

    private handleOnIsReadyTap(sensorDescription: SensorDescription) {
        this.updateSensorDescriptionStatus(sensorDescription, Status.WAITING_FOR_RESPONSE);

        this.logger.logInfoForNode(this.node.name, `Sending isReady request and waiting for response...`);
        sensorDescription.collector.isReady(this.node).then((ready) => {
            this.logger.logResultForNode(this.node.name, `Ready response: ${ ready ? 'node ready' : 'node not ready. Should prepare node'}`);
            let status;
            if (ready) {
                status = Status.READY;
            } else {
                status = Status.NOT_READY;
            }

            this.updateSensorDescriptionStatus(sensorDescription, status);
        });
    }

    private handleOnPrepareTap(sensorDescription: SensorDescription) {
        this.updateSensorDescriptionStatus(sensorDescription, Status.WAITING_FOR_RESPONSE)

        this.logger.logInfoForNode(this.node.name, `Sending prepare request to node and waiting for response. Should look at wearable device...`);
        sensorDescription.collector.prepare(this.node).then((prepareError: PrepareError) => {
            this.logger.logResultForNode(this.node.name, `Prepare response: ${ prepareError ? prepareError.message : 'device prepared successfully'}`);
            let status;
            if (prepareError) {
                status = Status.NOT_READY;
                console.log(prepareError.message);
            } else {
                status = Status.READY;
            }

            this.updateSensorDescriptionStatus(sensorDescription, status);
        });
    }

    private handleOnStartTap(sensorDescription: SensorDescription) {
        const collector = sensorDescription.collector;
        const listener = collector.listenSensorUpdates((sensorCallback) => {
            const records = sensorCallback.records;
            const deviceId = records[0].deviceId;
            getLogger().logResultForNode(deviceId, JSON.stringify(records));
        });
        this.listeners.set(sensorDescription.sensor, listener);
        collector.startCollecting(
            this.node,
            {
                sensorInterval: this.customSensorInterval ?? this.sensorIntervals.getValue(this.selectedDelayIndex),
                batchSize: this.batchSize
            }
        );

        this.updateSensorDescriptionStatus(sensorDescription, Status.LISTENING);
    }

    private handleOnStopTap(sensorDescription: SensorDescription) {
        const collector = sensorDescription.collector;
        const listener = this.listeners.get(sensorDescription.sensor);
        this.listeners.delete(sensorDescription.sensor);
        collector.stopListenSensorUpdates(listener);
        collector.stopCollecting(this.node);

        this.updateSensorDescriptionStatus(sensorDescription, Status.READY);
    }

    private updateSensorDescriptionStatus(sensorDescription: SensorDescription, status: Status) {
        const index = this.sensorDescription.indexOf(sensorDescription);
        this.sensorDescription[index].status = {
            id: status,
            message: this.status[status],
            iconColorBg: this.bgColors[status]
        }
        this.repeater.refresh();
    }
}

interface SensorDescription {
    parent: DeviceViewModel,
    collector: CollectorManager,
    sensor: SensorType,
    status: SensorStatus,
    icon: string,
}

interface SensorStatus {
    id: Status,
    message: string,
    iconColorBg: any,
}

enum Status {
    AVAILABLE_IN_DEVICE = "availableInDevice",
    WAITING_FOR_RESPONSE = "waitingForResponse",
    NOT_READY = "notReady",
    READY = "ready",
    LISTENING = "listening"
}

function iconForSensor(sensor: SensorType): string {
    let icon;
    switch (sensor) {
        case SensorType.ACCELEROMETER:
            icon = "e89f";
            break;
        case SensorType.GYROSCOPE:
            icon = "e84d";
            break;
        case SensorType.MAGNETOMETER:
            icon = "e87a";
            break;
        case SensorType.LOCATION:
            icon = "e0c8";
            break;
        case SensorType.HEART_RATE:
            icon = "e87d";
    }

    return String.fromCharCode(parseInt(icon, 16));
}

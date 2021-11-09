import { Button, Color, EventData, Observable, Repeater } from "@nativescript/core";
import { getLogger } from "~/home/logger/logger-view-model";
import { ValueList } from "nativescript-drop-down";
import { Node } from "nativescript-wearos-sensors/node";
import { CollectorManager, PrepareError, SensorDelay } from "nativescript-wearos-sensors/collection";
import { getSensorCollector, SensorType } from "nativescript-wearos-sensors/sensors";
import { SensorRecords } from "nativescript-wearos-sensors/sensors/records";

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

    private sensorDelays = new ValueList([
        { value: SensorDelay.NORMAL, display: "NORMAL" },
        { value: SensorDelay.UI, display: "UI" },
        { value: SensorDelay.GAME, display: "GAME" },
        { value: SensorDelay.FASTEST, display: "FASTEST" }
    ]);
    private selectedDelayIndex = 0;

    private batchSize = 50;

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
                icon: this.iconForSensor(sensor),
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
        sensorDescription.collector.listenSensorUpdates((records: SensorRecords<any>) => {
            this.logger.logResultForNode(this.node.name, `record received --> ${JSON.stringify(records)}`);
        });
        sensorDescription.collector.startCollecting(this.node, {
            sensorDelay: this.sensorDelays.getValue(this.selectedDelayIndex),
            batchSize: this.batchSize
        });
        this.logger.logInfoForNode(this.node.name, `Send start request for ${sensorDescription.sensor}`);

        this.updateSensorDescriptionStatus(sensorDescription, Status.LISTENING);
    }

    private handleOnStopTap(sensorDescription: SensorDescription) {
        sensorDescription.collector.stopCollecting(this.node);
        sensorDescription.collector.stopListenSensorUpdates();
        this.logger.logInfoForNode(this.node.name, `Send stop request for ${sensorDescription.sensor}`);
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

    private iconForSensor(sensor): string {
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

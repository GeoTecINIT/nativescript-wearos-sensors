import { Observable } from "@nativescript/core";
import { getLogger } from "~/home/logger/logger-view-model";
import { getNodeDiscoverer } from "nativescript-wearos-sensors/node";
import { getFreeMessageClient } from "nativescript-wearos-sensors/free-message";
import { getCollectorManager } from "nativescript-wearos-sensors/collection";
import { getStore } from "~/home/store";

export class DeviceListViewModel extends Observable {

    private logger;
    private scanning;
    private nodes: ConnectedNode[];

    constructor() {
        super();
        this.logger = getLogger();
        this.scanning = false;
        this.nodes = [];

        getCollectorManager().addSensorListener((sensorRecord) => {
            const samples = sensorRecord.samples;
            const deviceId = sensorRecord.deviceId;
            getStore().addRecord(sensorRecord);
            this.logger.logResultForNode(deviceId, JSON.stringify(samples));
        });
        getFreeMessageClient().registerListener((receivedMessage) => {
            this.logger.logInfo(`received single message ${JSON.stringify(receivedMessage)}`);
        });
    }

    getNode(index: number): ConnectedNode {
        if (index < 0 || index > this.nodes.length - 1)
            return undefined;
        return this.nodes[index];
    }

    onScanNodes() {
        const nodeDiscoverer = getNodeDiscoverer();
        this.logger.logInfo("Scanning for WearOS connected devices");
        this.nodes = [];
        this.scanning = true;
        this.notifyPropertyChange("nodes", this.nodes);
        this.notifyPropertyChange("scanning", this.scanning);

        nodeDiscoverer.getConnectedNodes()
            .then((nodesDiscovered) => {
                nodesDiscovered.forEach((nodeDiscovered) => {
                    if (nodeDiscovered.error) {
                        this.logger.logResult(nodeDiscovered.error);
                        return;
                    }

                    const node = nodeDiscovered.node;
                    this.logger.logResult(`Connected node --> ${JSON.stringify(node)}`);

                    const sensorsAvailability = {};
                    node.capabilities.forEach((capability) => sensorsAvailability[capability.toLowerCase()] = true)

                    this.nodes.push({
                        id: node.id,
                        name: node.name,
                        sensorsAvailability: sensorsAvailability,
                    });
                });
                this.notifyPropertyChange("nodes", this.nodes);
                this.logger.logInfo("Scan ended");
                this.scanning = false;
                this.notifyPropertyChange("scanning", this.scanning);
            });
    }
}

interface ConnectedNode {
    id: string,
    name: string,
    sensorsAvailability: { [key: string]: boolean },
}

const testNodes: ConnectedNode[] = [
    {
        id: "123456",
        name: "Node 1",
        sensorsAvailability: {
            accelerometer: true,
            gyroscope: true,
            magnetometer: true,
        }
    },
    {
        id: "654321",
        name: "Node 2",
        sensorsAvailability: {
            accelerometer: true,
            magnetometer: true,
            heart_rate: true,
            location: true
        }
    },
    {
        id: "654456",
        name: "Node 3",
        sensorsAvailability: {
            location: true
        }
    },
];

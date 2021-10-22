import { Observable } from "@nativescript/core";
import { getLogger } from "~/home/logger/logger-view-model";
import { getNodeDiscoverer } from "nativescript-wearos-sensors/internal/node/discoverer";

export class DeviceListViewModel extends Observable {

    private logger;
    private scanning;
    private nodes: ConnectedNode[];

    constructor() {
        super();
        this.logger = getLogger();
        this.scanning = false;
        this.nodes = [];
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
        nodeDiscoverer.getConnectedNodes().then((nodes) => {
            this.nodes = nodes.map((node) => {
                this.logger.logResult(`Connected node --> ${JSON.stringify(node)}`);
                const sensorsAvailability = {};

                node.capabilities.forEach((capability) => sensorsAvailability[capability.toLowerCase()] = true)

                return {
                    id: node.id,
                    name: node.name,
                    sensorsAvailability: sensorsAvailability,
                }
            });

            this.scanning = false;
            this.notifyPropertyChange("scanning", this.scanning);
            this.notifyPropertyChange("nodes", this.nodes);
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

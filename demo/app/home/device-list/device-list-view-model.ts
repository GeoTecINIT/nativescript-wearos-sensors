import { Observable } from "@nativescript/core";
import { NodeDiscoverer } from "nativescript-wearos-sensors/internal/node/node-discoverer.android";

export class DeviceListViewModel extends Observable {

    private nodes: ConnectedNode[] = testNodes;

    getNode(index: number): ConnectedNode {
        if (index < 0 || index > this.nodes.length - 1)
            return undefined;
        return this.nodes[index];
    }

    onScanNodes() {
        const nodeDiscoverer = new NodeDiscoverer();
        nodeDiscoverer.getConnectedNodes().then((nodes) => {
            this.nodes = nodes.map((node) => {
                const sensorsAvailability = {};

                node.capabilities.forEach((capability) => sensorsAvailability[capability.toLowerCase()] = true)

                console.log(sensorsAvailability);
                return {
                    id: node.id,
                    name: node.name,
                    sensorsAvailability: sensorsAvailability,
                }
            });

            this.notifyPropertyChange("nodes", this.nodes);
        })
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

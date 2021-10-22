import { NodeDiscoverer } from "./node-discoverer";
import { Application } from "@nativescript/core";
import { WearOsNode, wearOS } from "../../utils/android/wear-os-types.android";
import OnCompleteListener = com.google.android.gms.tasks.OnCompleteListener;
import { Node } from "../index";
import { CapabilityClient } from "../../communication/capabilities/android/capability-client.android";
import { getCapabilityAdvertiserResultService } from "../../communication/capabilities/android/capability-advertiser-result-service.android";
import { capabilityProtocol } from "../../communication/capabilities";

export class AndroidNodeDiscoverer implements NodeDiscoverer {

    constructor(
        private capabilityClient: CapabilityClient = new CapabilityClient(
            capabilityProtocol, getCapabilityAdvertiserResultService()
        ),
        private nodeClient: wearOS.NodeClient = wearOS.Wearable.getNodeClient(Application.android.context)
    ) {
    }

    public async getConnectedNodes(): Promise<Node[]> {
        const connectedNodes = this.nodeClient.getConnectedNodes();

        const connectedNodesPromise = new Promise<java.util.List<WearOsNode>>((resolve, reject) => {
           connectedNodes.addOnCompleteListener(new OnCompleteListener({
               onComplete: task => {
                   if (task.isSuccessful()) {
                       resolve(task.getResult());
                   } else {
                       reject(task.getException().getMessage());
                   }
               }
           }));
        });

        const wearosNodes = await connectedNodesPromise;
        const nodes: Node[] = [];
        const iterator = wearosNodes.iterator();
        while (iterator.hasNext()) {
            const nativeNode = iterator.next();
            const node = new Node(
                nativeNode.getId(),
                nativeNode.getDisplayName(),
            );

            try {
                const capabilityResult = await this.capabilityClient.sendCapabilityAdvertisementRequest(node);
                node.capabilities = capabilityResult.capabilities;
                nodes.push(node);
            } catch (error) {
                console.log(error);
            }
        }

        return nodes;
    }
}

import { Application } from "@nativescript/core";
import { WearOsNode, wearOS } from "../utils/android/wear-os-types.android";
import OnCompleteListener = com.google.android.gms.tasks.OnCompleteListener;
import { Node } from "./node.android";
import { CapabilityClient } from "../communication/capabilities/android/capability-client.android";
import { getCapabilityAdvertiserResultService } from "../communication/capabilities/android/capability-advertiser-result-service.android";
import { capabilityProtocol } from "../communication/capabilities";

export class NodeDiscoverer {

    private nodeClient: wearOS.NodeClient;
    constructor(
        private capabilityClient: CapabilityClient = new CapabilityClient(
            capabilityProtocol, getCapabilityAdvertiserResultService()
        )
    ) {
        this.nodeClient = wearOS.Wearable.getNodeClient(Application.android.context);
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
            const node = iterator.next();
            const capabilityResult = await this.capabilityClient.sendCapabilityAdvertisementRequest(node);

            nodes.push(
                new Node(
                    node.getId(),
                    node.getDisplayName(),
                    capabilityResult.capabilities
                )
            );
        }

        return nodes;
    }
}

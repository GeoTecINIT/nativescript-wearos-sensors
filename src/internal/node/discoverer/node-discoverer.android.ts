import {NodeDiscovered, NodeDiscoverer} from "./node-discoverer";
import { Application } from "@nativescript/core";
import { WearOsNode, wearOS } from "../../utils/android/wear-os-types.android";
import OnCompleteListener = com.google.android.gms.tasks.OnCompleteListener;
import { Node } from "../index";
import { CapabilityClient } from "../../communication/capabilities/android/capability-client.android";
import { getCapabilityAdvertiserResultService } from "../../communication/capabilities/android/capability-advertiser-result-service.android";
import { capabilityProtocol } from "../../communication/capabilities";
import { EMPTY, from, Observable } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";

export class AndroidNodeDiscoverer implements NodeDiscoverer {

    constructor(
        private capabilityClient: CapabilityClient = new CapabilityClient(
            capabilityProtocol, getCapabilityAdvertiserResultService()
        ),
        private nodeClient: wearOS.NodeClient = wearOS.Wearable.getNodeClient(Application.android.context)
    ) {
    }

    public getLocalNode(): Promise<Node> {
        const localNode = this.nodeClient.getLocalNode();

        return new Promise<Node>((resolve, reject) => {
            localNode.addOnCompleteListener(new OnCompleteListener({
                onComplete: task => {
                    if (task.isSuccessful()) {
                        const nativeNode = task.getResult();
                        const node = new Node(nativeNode.getId(), nativeNode.getDisplayName());
                        resolve(node);
                    } else {
                        reject(task.getException().getMessage());
                    }
                }
            }));
        });
    }

    public getConnectedNodes(): Observable<NodeDiscovered> {
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

        return from(connectedNodesPromise).pipe(
            switchMap((wearosNodes: java.util.List<WearOsNode>) => {
                const totalNodes = wearosNodes.size();
                if (totalNodes === 0)
                    return EMPTY;

                return new Observable<NodeDiscovered>(subscriber => {
                    const iterator = wearosNodes.iterator();
                    let responseCount = 0;
                    while (iterator.hasNext()) {
                        const nativeNode = iterator.next();
                        const node = new Node(
                            nativeNode.getId(),
                            nativeNode.getDisplayName(),
                        );

                        this.capabilityClient.sendCapabilityAdvertisementRequest(node)
                            .then((capabilityResult) => {
                                node.capabilities = capabilityResult.capabilities;
                                subscriber.next({
                                    node: node,
                                });
                            }).catch((error) => {
                            console.log(error);
                            subscriber.next({
                                node: node,
                                error: error,
                            });
                        }).finally(() => {
                            responseCount++;
                            if (responseCount === totalNodes)
                                subscriber.complete();
                        });
                    }
                });
            }), catchError((err => EMPTY))
        );
    }
}

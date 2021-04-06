import { android as androidApp } from "tns-core-modules/application/application";

import OnCompleteListener = com.google.android.gms.tasks.OnCompleteListener;
import { NodeSet, wearOS } from "./utils/android/wear-os-types.android";

export class CapabilityDiscoverer {

    constructor(private capability: string) {
    }

    public async getAvailableNodes(): Promise<NodeSet> {
        const capability = wearOS.Wearable.getCapabilityClient(androidApp.context)
            .getCapability(this.capability, wearOS.CapabilityClient.FILTER_REACHABLE);

        const capabilityPromise = new Promise<wearOS.CapabilityInfo>((resolve, reject) => {
            capability.addOnCompleteListener(new OnCompleteListener({
                onComplete: task => {
                    if (task.isSuccessful()) {
                        resolve(task.getResult());
                    } else {
                        reject(task.getException());
                    }
                }
            }));
        });

        const capabilityResult = await capabilityPromise;
        return capabilityResult.getNodes();
    }
}

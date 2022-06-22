import { getNodeDiscoverer } from "../node/discoverer";
import { Utils } from "@nativescript/core";

export async function isBridgeWearOsAppInstalled(): Promise<boolean> {
    const nodeDiscoverer = getNodeDiscoverer();

    try {
        await nodeDiscoverer.getLocalNode();
        return true;
    } catch (ex) {
        return false;
    }
}

export function openStoreToInstallBridgeApp() {
    const context = Utils.android.getApplicationContext();
    const intent = new android.content.Intent(
        android.content.Intent.ACTION_VIEW,
        android.net.Uri.parse("market://details?id=com.google.android.wearable.app")
    );
    intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);

    context.startActivity(intent);
}
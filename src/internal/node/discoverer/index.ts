import { NodeDiscoverer } from "./node-discoverer";
import { Application } from "@nativescript/core";
import { AndroidNodeDiscoverer } from "./node-discoverer.android";

export function getNodeDiscoverer(): NodeDiscoverer {
    if (Application.android) {
        return new AndroidNodeDiscoverer();
    } else {
        return null;
    }
}

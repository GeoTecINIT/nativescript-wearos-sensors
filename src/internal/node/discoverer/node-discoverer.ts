import { Node } from "../index";

export interface NodeDiscoverer {
    getConnectedNodes(): Promise<Node[]>;
}

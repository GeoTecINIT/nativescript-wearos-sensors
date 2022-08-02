import { Node } from "../index";

export interface NodeDiscoverer {
    getLocalNode(): Promise<Node>;
    areConnectedNodes(): Promise<boolean>;
    getConnectedNodes(timeout?: number): Promise<NodeDiscovered[]>;
}

export interface NodeDiscovered {
    node: Node;
    error?: any;
}

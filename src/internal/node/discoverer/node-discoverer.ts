import { Node } from "../index";

export interface NodeDiscoverer {
    getLocalNode(): Promise<Node>;
    getConnectedNodes(timeout?: number): Promise<NodeDiscovered[]>;
}

export interface NodeDiscovered {
    node: Node;
    error?: any;
}

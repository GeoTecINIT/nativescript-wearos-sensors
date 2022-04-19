import { Node } from "../index";
import { Observable } from "rxjs";

export interface NodeDiscoverer {
    getLocalNode(): Promise<Node>;
    getConnectedNodes(): Observable<NodeDiscovered>;
}

export interface NodeDiscovered {
    node: Node;
    error?: any;
}

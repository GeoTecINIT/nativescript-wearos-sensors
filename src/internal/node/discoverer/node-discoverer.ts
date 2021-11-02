import { Node } from "../index";
import { Observable } from "rxjs";

export interface NodeDiscoverer {
    getConnectedNodes(): Observable<NodeDiscovered>;
}

export interface NodeDiscovered {
    node: Node;
    error?: any;
}

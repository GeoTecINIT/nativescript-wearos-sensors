import { CommunicationProtocol } from "./communication-protocol";

export interface CommunicationResultService {
    setProtocol(protocol: CommunicationProtocol): void;
    setResolutionCallbackForNode(nodeId: string, callback: (resolution) => void): void;
}

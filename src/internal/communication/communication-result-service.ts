import { CommunicationProtocol } from "./communication-protocol";

export interface CommunicationResultService {
    setProtocol(protocol: CommunicationProtocol): void;
    setResolutionCallback(callback: (resolution) => void): void;
}

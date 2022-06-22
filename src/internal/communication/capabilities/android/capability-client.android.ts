import {
    CapabilityAdvertisementResult,
    CapabilityAdvertiserResultService
} from "./capability-advertiser-result-service.android";
import { CapabilityAdvertiserProtocol } from "../index";
import { CommunicationClient } from "../../communication-client.android";
import { Node } from "../../../node";

export class CapabilityClient extends CommunicationClient<CapabilityAdvertisementResult> {

    constructor(
        private protocol: CapabilityAdvertiserProtocol,
        private capabilityAdvertiserService: CapabilityAdvertiserResultService,
    ) {
        super(capabilityAdvertiserService);
    }

    public async sendCapabilityAdvertisementRequest(node: Node, timeout: number): Promise<CapabilityAdvertisementResult> {
        const resolutionPromise = this.createResolutionPromise(this.protocol, node, timeout);

        await this.sendMessage(node, this.protocol.messagePath);
        return await resolutionPromise;
    }
}

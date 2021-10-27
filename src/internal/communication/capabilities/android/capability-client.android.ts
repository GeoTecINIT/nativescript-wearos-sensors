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

    public async sendCapabilityAdvertisementRequest(node: Node): Promise<CapabilityAdvertisementResult> {
        const resolutionPromise = this.createResolutionPromise(this.protocol, node);

        await this.sendMessage(node, this.protocol.messagePath);
        return await resolutionPromise;
    }
}

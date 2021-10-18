import {
    CapabilityAdvertisementResult,
    CapabilityAdvertiserResultService
} from "./capability-advertiser-result-service.android";
import { CapabilityAdvertiserProtocol } from "../index";
import { CommunicationClient } from "../../communication-client.android";
import { Node } from "../../../node/node.android";

export class CapabilityClient extends CommunicationClient<CapabilityAdvertisementResult> {

    constructor(
        private protocol: CapabilityAdvertiserProtocol,
        private capabilityAdvertiserService: CapabilityAdvertiserResultService,
    ) {
        super(capabilityAdvertiserService);
    }

    public async sendCapabilityAdvertisementRequest(node: Node): Promise<CapabilityAdvertisementResult> {
        this.capabilityAdvertiserService.setProtocol(this.protocol);
        const resolutionPromise = new Promise<CapabilityAdvertisementResult>(async (resolve) => {
            this.capabilityAdvertiserService.setResolutionCallback(
                (resolutionResult) => resolve(resolutionResult)
            );
        });

        await this.sendMessage(node, this.protocol.messagePath);
        return await resolutionPromise;
    }
}

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
        const resolutionPromise = new Promise<CapabilityAdvertisementResult>(async (resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(`Timeout for capability advertising in node ${node.name} (${node.id})`);
            }, 5000);

            this.capabilityAdvertiserService.setResolutionCallback(
                (resolutionResult) => {
                    clearTimeout(timeoutId);
                    resolve(resolutionResult);
                }
            );
        });

        await this.sendMessage(node, this.protocol.messagePath);
        return await resolutionPromise;
    }
}

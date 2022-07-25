import { MessagingClient } from "../messaging-client";
import { getResultMessagingService, MessagingResult } from "./messaging-result-service.android";
import { CommunicationClient } from "../../communication-client.android";
import { Node } from "../../../node";
import { SensorType } from "../../../sensors/sensor-type";
import { protocols } from "../protocol";

export class MessagingClientImpl extends CommunicationClient<MessagingResult> implements MessagingClient {

    constructor(
        private sensor: SensorType,
        private protocol = protocols.get(sensor),
        resultMessagingService =  getResultMessagingService(sensor)
    ) {
        super(resultMessagingService);
    }

    public async sendIsReadyMessage(node: Node): Promise<MessagingResult> {
        return await this.sendMessageAndWaitForResolution(node, this.protocol.readyProtocol, 5000);
    }

    public async sendPrepareMessage(node: Node): Promise<MessagingResult> {
        return await this.sendMessageAndWaitForResolution(node, this.protocol.prepareProtocol);
    }

    public async sendStartMessage(node: Node, message?: string) {
        await this.sendMessage(node, this.protocol.startMessagePath, message);
    }

    public async sendStopMessage(node: Node, message?: string) {
        await this.sendMessage(node, this.protocol.stopMessagePath, message);
    }
}

let _instances: Map<SensorType, MessagingClient> = new Map();
export function getMessagingClient(sensorType: SensorType): MessagingClient {
    if (!_instances.get(sensorType)) {
        _instances.set(sensorType, new MessagingClientImpl(sensorType));
    }

    return _instances.get(sensorType);
}

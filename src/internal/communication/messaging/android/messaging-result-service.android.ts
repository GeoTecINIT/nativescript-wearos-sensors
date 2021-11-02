import { CommunicationResultService } from "../../communication-result-service";
import WearableListenerServiceDelegate = es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate;
import { wearOS } from "../../../utils/android/wear-os-types.android";
import { ResultMessagingProtocol } from "../index";
import { decodeMessage } from "../../encoder-decoder";

export class MessagingResultService implements CommunicationResultService, WearableListenerServiceDelegate {

    private protocol: ResultMessagingProtocol;
    private resolutionCallbacks = new Map<string, (messagingResult: MessagingResult) => void>();

    public setProtocol(protocol) {
        this.protocol = protocol;
    }

    public setResolutionCallbackForNode(nodeId: string, resolutionCallback) {
        this.resolutionCallbacks.set(nodeId, resolutionCallback);
    }

    public onMessageReceived(message: wearOS.MessageEvent) {
        const messagePath = message.getPath();

        if (messagePath !== this.protocol.messagePath) {
            return;
        }

        if (message.getData() === null) {
            return;
        }

        const decodedMessage = decodeMessage(message.getData());
        const messageParts = decodedMessage.split('#');
        if (messageParts[0] === this.protocol.successResponse) {
            this.resolutionCallbacks.get(message.getSourceNodeId())({
                nodeId: message.getSourceNodeId(),
                success: true,
            });
        } else if (messageParts[0] === this.protocol.failureResponse) {
            const partialResolution = { nodeId: message.getSourceNodeId(), success: false };
            const resolution = messageParts.length > 1 ?
                { ...partialResolution, message: messageParts[1]} :
                partialResolution;
            this.resolutionCallbacks.get(message.getSourceNodeId())(resolution);
        }
    }
}

export interface MessagingResult {
    nodeId: string;
    success: boolean;
    message?: string;
}

// FIXME: will this work with multiple sensors? Maybe one instance per sensor will be needed
let _instance: MessagingResultService;
export function getResultMessagingService(): MessagingResultService {
    if (!_instance) {
        _instance = new MessagingResultService();
    }

    return _instance;
}

import { CommunicationResultService } from "../../communication-result-service";
import WearableListenerServiceDelegate = es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate;
import { FreeMessage, FreeMessageProtocol, ReceivedMessage } from "../index";
import { CommunicationProtocol } from "../../communication-protocol";
import { wearOS } from "../../../utils/android/wear-os-types.android";
import { decodeMessage } from "../../encoder-decoder";
import { decodeFreeMessage } from "../encoder-decoder";

export class FreeMessageResultService implements CommunicationResultService, WearableListenerServiceDelegate {

    private protocol: FreeMessageProtocol;
    private resolutionCallbacks = new Map<string, (freeMessage: ReceivedMessage) => void>();

    setProtocol(protocol: CommunicationProtocol): void {
        this.protocol = protocol as FreeMessageProtocol;
    }

    setResolutionCallbackForNode(nodeId: string, callback: (freeMessage) => void): void {
        this.resolutionCallbacks.set(nodeId, callback);
    }

    onMessageReceived(message: wearOS.MessageEvent): void {
        const path = message.getPath();
        const sourceNodeId = message.getSourceNodeId();

        // For now, smartphone only accepts without-response messages
        if (path !== this.protocol.withoutResponse) {
            return;
        }

        if (message.getData() === null) {
            return;
        }

        const stringMessage: string = decodeMessage(message.getData());
        const freeMessage: FreeMessage = decodeFreeMessage(stringMessage);

        if (freeMessage.inResponseTo && this.resolutionCallbacks.has(sourceNodeId)) {
            const callback = this.resolutionCallbacks.get(sourceNodeId);
            callback({
                senderNodeId: sourceNodeId,
                freeMessage: freeMessage
            });
            this.resolutionCallbacks.delete(sourceNodeId);
            return;
        }

        // TODO: listener callback
        console.log(`[FreeMessageResultService]: ${JSON.stringify(freeMessage)}`);
    }
}

let _instance;
export function getFreeMessageResultService(): FreeMessageResultService {
    if (!_instance) {
        _instance = new FreeMessageResultService();
    }
    return _instance;
}
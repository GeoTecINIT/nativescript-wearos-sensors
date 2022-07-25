import { CommunicationResultService } from "../../communication-result-service";
import WearableListenerServiceDelegate = es.uji.geotec.wearossensors.WearableListenerServiceDelegate;
import { FreeMessage, FreeMessageListener, freeMessageProtocol, FreeMessageProtocol, ReceivedMessage } from "../index";
import { CommunicationProtocol } from "../../communication-protocol";
import { wearOS } from "../../../utils/android/wear-os-types.android";
import { decodeMessage } from "../../encoder-decoder";
import { decodeFreeMessage } from "../encoder-decoder";

export class FreeMessageResultService implements CommunicationResultService, WearableListenerServiceDelegate {

    private protocol: FreeMessageProtocol = freeMessageProtocol;
    private resolutionCallbacks = new Map<string, FreeMessageListener>();
    private defaultListener: FreeMessageListener;

    setProtocol(protocol: CommunicationProtocol): void {
        this.protocol = protocol as FreeMessageProtocol;
    }

    setResolutionCallbackForNode(nodeId: string, callback: (freeMessage) => void): void {
        this.resolutionCallbacks.set(nodeId, callback);
    }

    setDefaultListener(listener: FreeMessageListener): void {
        this.defaultListener = listener;
    }

    clearDefaultListener(): void {
        this.defaultListener = undefined;
    }

    onMessageReceived(message: wearOS.MessageEvent): void {
        const path = message.getPath();
        const senderNodeId = message.getSourceNodeId();

        // For now, smartphone only accepts without-response messages
        if (path !== this.protocol.withoutResponse) {
            return;
        }

        if (message.getData() === null) {
            return;
        }

        const stringMessage: string = decodeMessage(message.getData());
        const freeMessage: FreeMessage = decodeFreeMessage(stringMessage);
        const receivedMessage: ReceivedMessage = {
            senderNodeId,
            freeMessage
        };

        if (freeMessage.inResponseTo && this.resolutionCallbacks.has(senderNodeId)) {
            const callback = this.resolutionCallbacks.get(senderNodeId);
            callback(receivedMessage);
            this.resolutionCallbacks.delete(senderNodeId);
            return;
        }

        if (!this.defaultListener) {
            throw new Error(`received message ${JSON.stringify(receivedMessage)} but there are no callbacks set`);
        }

        this.defaultListener(receivedMessage);
    }
}

let _instance;
export function getFreeMessageResultService(): FreeMessageResultService {
    if (!_instance) {
        _instance = new FreeMessageResultService();
    }
    return _instance;
}
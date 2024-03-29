import { CommunicationResultService } from "../../communication-result-service";
import WearableListenerServiceDelegate = es.uji.geotec.wearossensors.WearableListenerServiceDelegate;
import { PlainMessage, PlainMessageListener, plainMessageProtocol, PlainMessageProtocol, ReceivedMessage } from "../index";
import { CommunicationProtocol } from "../../communication-protocol";
import { wearOS } from "../../../utils/android/wear-os-types.android";
import { decodeMessage } from "../../encoder-decoder";
import { decodePlainMessage } from "../encoder-decoder";

export class PlainMessageResultService implements CommunicationResultService, WearableListenerServiceDelegate {

    private protocol: PlainMessageProtocol = plainMessageProtocol;
    private resolutionCallbacks = new Map<string, PlainMessageListener>();
    private defaultListener: PlainMessageListener;

    setProtocol(protocol: CommunicationProtocol): void {
        this.protocol = protocol as PlainMessageProtocol;
    }

    setResolutionCallbackForNode(nodeId: string, callback: (plainMessage) => void): void {
        this.resolutionCallbacks.set(nodeId, callback);
    }

    setDefaultListener(listener: PlainMessageListener): void {
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
        const plainMessage: PlainMessage = decodePlainMessage(stringMessage);
        const receivedMessage: ReceivedMessage = {
            senderNodeId,
            plainMessage
        };

        if (plainMessage.inResponseTo && this.resolutionCallbacks.has(senderNodeId)) {
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
export function getPlainMessageResultService(): PlainMessageResultService {
    if (!_instance) {
        _instance = new PlainMessageResultService();
    }
    return _instance;
}
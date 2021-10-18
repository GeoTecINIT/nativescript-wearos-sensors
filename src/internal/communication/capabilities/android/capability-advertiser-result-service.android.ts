import { CommunicationResultService } from "../../communication-result-service";
import WearableListenerServiceDelegate = es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate;
import { CapabilityAdvertiserProtocol } from "../index";
import { wearOS } from "../../../utils/android/wear-os-types.android";
import { fromString, SensorType} from "../../../sensors/sensor-type";
import { decodeMessage } from "../../encoder-decoder";

export class CapabilityAdvertiserResultService implements CommunicationResultService, WearableListenerServiceDelegate {

    private protocol: CapabilityAdvertiserProtocol;
    private resolutionCallback: (capabilityResult: CapabilityAdvertisementResult) => void;

    public setProtocol(protocol) {
        this.protocol = protocol;
    }

    public setResolutionCallback(resolutionCallback) {
        this.resolutionCallback = resolutionCallback;
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
        const capabilities = decodedMessage.split("#");

        this.resolutionCallback({
            nodeId: message.getSourceNodeId(),
            capabilities: capabilities.map((capability) => fromString(capability)),
        });
    }
}

export interface CapabilityAdvertisementResult {
    nodeId: string;
    capabilities: SensorType[];
}

let _instance: CapabilityAdvertiserResultService;
export function getCapabilityAdvertiserResultService(): CapabilityAdvertiserResultService {
    if (!_instance) {
        _instance = new CapabilityAdvertiserResultService();
    }

    return _instance;
}

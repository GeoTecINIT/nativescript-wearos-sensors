import { CollectorManager } from "../../../../collector-manager";
import { CollectorManagerImpl } from "../../../../collector-manager-impl.android";
import { SensorCallbackManager } from "../../../../sensor-callback-manager";
import { getGyroscopeRecordService} from "./record-messaging-service.android";
import { buildGyroscopeMessagingProtocol } from "./protocol.android";
import { MessagingClientImpl } from "../../../../messaging/android/messaging-client.android";
import { getResultMessagingService } from "../../../../messaging/android/result-messaging-service.android";

export function getAndroidGyroscopeCollector(): CollectorManager {
    const protocol = buildGyroscopeMessagingProtocol();
    const callback = new SensorCallbackManager("newGyroscopeRecord");
    const messagingClient = new MessagingClientImpl(
        protocol,
        getResultMessagingService()
    );
    const recordService = getGyroscopeRecordService();
    recordService.setProtocol(protocol);
    recordService.setCallbackManager(callback);
    return new CollectorManagerImpl(
        protocol,
        "gyroscope-sensor",
        messagingClient,
        callback,
    );
}

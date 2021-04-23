import { CollectorManager } from "../../../../collector-manager";
import { CollectorManagerImpl } from "../../../../collector-manager-impl.android";
import { SensorCallbackManager } from "../../../../sensor-callback-manager";
import { getMagnetometerRecordService } from "./record-messaging-service.android";
import { buildMagnetometerMessagingProtocol } from "./protocol.android";
import { MessagingClientImpl } from "../../../../messaging/android/messaging-client.android";
import { getResultMessagingService } from "../../../../messaging/android/result-messaging-service.android";

export function getAndroidMagnetometerCollector(): CollectorManager {
    const protocol = buildMagnetometerMessagingProtocol();
    const callback = new SensorCallbackManager("newMagnetometerRecord");
    const messagingClient = new MessagingClientImpl(
        protocol,
        getResultMessagingService()
    );
    const recordService = getMagnetometerRecordService();
    recordService.setProtocol(protocol);
    recordService.setCallbackManager(callback);
    return new CollectorManagerImpl(
        protocol,
        "magnetometer-sensor",
        messagingClient,
        callback,
    );
}

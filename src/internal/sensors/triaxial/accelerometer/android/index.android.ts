import { CollectorManager } from "../../../../collector-manager";
import { CollectorManagerImpl } from "../../../../collector-manager-impl.android";
import { SensorCallbackManager } from "../../../../sensor-callback-manager";
import { getAccelerometerRecordService } from "./record-messaging-service.android";
import { buildAccelerometerMessagingProtocol } from "./protocol.android";
import { MessagingClientImpl } from "../../../../messaging/android/messaging-client.android";
import { getResultMessagingService } from "../../../../messaging/android/result-messaging-service.android";

export function getAndroidAccelerometerCollector(): CollectorManager {
    const protocol = buildAccelerometerMessagingProtocol();
    const callback = new SensorCallbackManager("newAccelerometerRecord");
    const messagingClient = new MessagingClientImpl(
        protocol,
        getResultMessagingService()
    );
    const recordService = getAccelerometerRecordService();
    recordService.setProtocol(protocol);
    recordService.setCallbackManager(callback);
    return new CollectorManagerImpl(
        protocol,
        "accelerometer-sensor",
        messagingClient,
        callback,
    );
}

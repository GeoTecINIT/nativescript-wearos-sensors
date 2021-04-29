import { CollectorManager } from "../../../collector-manager";
import { buildLocationMessagingProtocol } from "./protocol.android";
import { SensorCallbackManager } from "../../../sensor-callback-manager";
import { MessagingClientImpl } from "../../../messaging/android/messaging-client.android";
import { getResultMessagingService } from "../../../messaging/android/result-messaging-service.android";
import { getLocationRecordService } from "./record-messaging-service.android";
import { CollectorManagerImpl } from "../../../collector-manager-impl.android";

// TODO: create a parameterized collector provider
export function getAndroidLocationCollector(): CollectorManager {
    const protocol = buildLocationMessagingProtocol();
    const callback = new SensorCallbackManager("newLocationRecord");
    const messagingClient = new MessagingClientImpl(
        protocol,
        getResultMessagingService()
    );
    const recordsService = getLocationRecordService();
    recordsService.setProtocol(protocol);
    recordsService.setCallbackManager(callback);
    return new CollectorManagerImpl(
        protocol,
        "location-sensor",
        messagingClient,
        callback
    );
}

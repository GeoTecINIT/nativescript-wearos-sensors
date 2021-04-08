import { CollectorManager } from "../../collector-manager";
import { CollectorManagerImpl } from "../../collector-manager-impl.android";
import { AccelerometerSensorRecord } from "../record";
import { SensorCallbackManager } from "../../sensor-callback-manager";
import { getAccelerometerRecordListener } from "./record-messaging-listener.android";
import { buildAccelerometerMessagingProtocol } from "./protocol.android";
import { MessagingClientImpl } from "../../messaging/android/messaging-client.android";

export function getAndroidAccelerometerCollector(): CollectorManager {
    const protocol = buildAccelerometerMessagingProtocol();
    const callback = new SensorCallbackManager<AccelerometerSensorRecord>("newAccelerometerRecord");
    const messagingClient = new MessagingClientImpl(protocol);
    return new CollectorManagerImpl<AccelerometerSensorRecord>(
        protocol,
        "accelerometer-sensor",
        messagingClient,
        callback,
        getAccelerometerRecordListener(protocol, callback),
    );
}

import { WearableConfig } from "../../../wearable-config";
export { getAccelerometerRecordService } from "./record-messaging-service.android";

export function getAccelerometerDefaultWearableConfig(): WearableConfig {
    return {
        capability: "accelerometer-sensor",
        messagingPrefixPath: "accelerometer"
    };
}

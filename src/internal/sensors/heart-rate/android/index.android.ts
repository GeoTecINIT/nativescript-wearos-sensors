import { WearableConfig } from "../../wearable-config";
export { getHeartRateRecordService } from "./record-messaging-service.android";

export function getHeartRateDefaultWearableConfig(): WearableConfig {
    return {
        capability: "heart-rate-sensor",
        messagingPrefixPath: "heart-rate"
    };
}

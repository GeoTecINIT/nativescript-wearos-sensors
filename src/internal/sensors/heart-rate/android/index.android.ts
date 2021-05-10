import { WearableConfig } from "../../index";
export { getHeartRateRecordService } from "./record-messaging-service.android";

export function getHeartRateDefaultWearableConfig(): WearableConfig {
    return {
        capability: "heart-rate-sensor",
        messagingPrefixPath: "heart-rate"
    };
}

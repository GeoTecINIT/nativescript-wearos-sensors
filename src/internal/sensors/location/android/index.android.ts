import { WearableConfig } from "../../wearable-config";
export { getLocationRecordService } from "./record-messaging-service.android";

export function getLocationDefaultWearableConfig(): WearableConfig {
    return {
        capability: "location-sensor",
        messagingPrefixPath: "location"
    };
}

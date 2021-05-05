import { WearableConfig } from "../../index";
export { getLocationRecordService } from "./record-messaging-service.android";

export function getLocationDefaultWearableConfig(): WearableConfig {
    return {
        capability: "location-sensor",
        messagingPrefixPath: "location"
    };
}

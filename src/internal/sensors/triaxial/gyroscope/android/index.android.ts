import { WearableConfig } from "../../../index";
export { getGyroscopeRecordService } from "./record-messaging-service.android";

export function getGyroscopeDefaultWearableConfig(): WearableConfig {
    return {
        capability: "gyroscope-sensor",
        messagingPrefixPath: "gyroscope"
    };
}

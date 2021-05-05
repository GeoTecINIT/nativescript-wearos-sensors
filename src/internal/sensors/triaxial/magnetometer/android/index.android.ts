import { WearableConfig } from "../../../index";
export { getMagnetometerRecordService } from "./record-messaging-service.android";

export function getMagnetometerDefaultWearableConfig(): WearableConfig {
    return {
        capability: "magnetometer-sensor",
        messagingPrefixPath: "magnetometer"
    };
}

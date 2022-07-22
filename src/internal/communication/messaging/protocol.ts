import { MessagingProtocol } from "./index";
import { SensorType } from "../../sensors/sensor-type";

const DEFAULT_START_SUFFIX = "start";
const DEFAULT_STOP_SUFFIX = "stop";
const DEFAULT_READY_SUFFIX = "ready";
const DEFAULT_PREPARE_SUFFIX = "prepare";
const DEFAULT_SUCCESS_RESPONSE = "success";
const DEFAULT_FAILURE_RESPONSE = "failure";
const DEFAULT_NEW_RECORD_SUFFIX = "new-record";

function buildMessagingProtocol(prefix: string): MessagingProtocol {
    return {
        startMessagePath: joinPrefixSuffix(prefix, DEFAULT_START_SUFFIX),
        stopMessagePath: joinPrefixSuffix(prefix, DEFAULT_STOP_SUFFIX),
        readyProtocol: {
            messagePath: joinPrefixSuffix(prefix, DEFAULT_READY_SUFFIX),
            successResponse: DEFAULT_SUCCESS_RESPONSE,
            failureResponse: DEFAULT_FAILURE_RESPONSE,
        },
        prepareProtocol: {
            messagePath: joinPrefixSuffix(prefix, DEFAULT_PREPARE_SUFFIX),
            successResponse: DEFAULT_SUCCESS_RESPONSE,
            failureResponse: DEFAULT_FAILURE_RESPONSE,
        },
        newRecordMessagePath: joinPrefixSuffix(prefix, DEFAULT_NEW_RECORD_SUFFIX),
    };
}

function joinPrefixSuffix(prefix: string, suffix: string): string {
    return `/${prefix}/${suffix}`;
}

export const protocols = new Map<SensorType, MessagingProtocol>(
    [
        [SensorType.ACCELEROMETER, buildMessagingProtocol(SensorType.ACCELEROMETER.toLowerCase())],
        [SensorType.GYROSCOPE, buildMessagingProtocol(SensorType.GYROSCOPE.toLowerCase())],
        [SensorType.MAGNETOMETER, buildMessagingProtocol(SensorType.MAGNETOMETER.toLowerCase())],
        [SensorType.LOCATION, buildMessagingProtocol(SensorType.LOCATION.toLowerCase())],
        [SensorType.HEART_RATE, buildMessagingProtocol(SensorType.HEART_RATE.toLowerCase())],
    ]
);

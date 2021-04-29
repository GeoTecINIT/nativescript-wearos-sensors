import { MessagingProtocol } from "../../../messaging";

const DEFAULT_START_MESSAGE_PATH = "/location/start";
const DEFAULT_STOP_MESSAGE_PATH = "/location/stop";
const DEFAULT_READY_MESSAGE_PATH = "/location/ready";
const DEFAULT_PREPARE_MESSAGE_PATH = "/location/prepare";
const DEFAULT_SUCCESS_RESPONSE = "success";
const DEFAULT_FAILURE_RESPONSE = "failure";
const DEFAULT_NEW_RECORD_MESSAGE_PATH = "/location/new-record";

// TODO: create a parameterized protocol builder
export function buildLocationMessagingProtocol(): MessagingProtocol {
    return {
        startMessagePath: DEFAULT_START_MESSAGE_PATH,
        stopMessagePath: DEFAULT_STOP_MESSAGE_PATH,
        readyProtocol: {
            messagePath: DEFAULT_READY_MESSAGE_PATH,
            successResponse: DEFAULT_SUCCESS_RESPONSE,
            failureResponse: DEFAULT_FAILURE_RESPONSE,
        },
        prepareProtocol: {
            messagePath: DEFAULT_PREPARE_MESSAGE_PATH,
            successResponse: DEFAULT_SUCCESS_RESPONSE,
            failureResponse: DEFAULT_FAILURE_RESPONSE,
        },
        newRecordMessagePath: DEFAULT_NEW_RECORD_MESSAGE_PATH,
    };
}

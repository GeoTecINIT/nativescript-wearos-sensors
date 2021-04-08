import { Node, wearOS } from "nativescript-wearos-sensors/internal/utils/android/wear-os-types.android";
import { MessagingProtocol } from "nativescript-wearos-sensors/internal/messaging";
import {ResolutionResult} from "../../../../src/internal/messaging/android/result-messaging-listener.android";

export function buildFakeNode(id: string, name: string, nearby: boolean): Node {
    return new wearOS.Node({
        getId(): string {
            return id;
        },
        getDisplayName(): string {
            return name;
        },
        isNearby(): boolean {
            return nearby;
        }
    })
}

export function getFakeMessagingProtocol(): MessagingProtocol {
    return {
        startMessagePath: "testStart",
        stopMessagePath: "testStop",
        readyProtocol: {
            messagePath: "testReady",
            successResponse: "testReadySuccess",
            failureResponse: "testReadyFailure",
        },
        prepareProtocol: {
            messagePath: "testPrepare",
            successResponse: "testPrepareSuccess",
            failureResponse: "testPrepareFailure",
        },
        newRecordMessagePath: "testNewRecord",
    }
}

export function buildFakeResolutionResult(
    nodeId: string,
    success: boolean,
    message?: string,
): ResolutionResult {
    const resolutionResult = { nodeId, success };
    if (message) {
        return { ...resolutionResult, message };
    }
    return resolutionResult;
}

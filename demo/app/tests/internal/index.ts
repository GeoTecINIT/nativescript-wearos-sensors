import { Node, wearOS } from "nativescript-wearos-sensors/internal/utils/android/wear-os-types.android";
import { MessagingProtocol } from "nativescript-wearos-sensors/internal/messaging";
import { ResolutionResult } from "nativescript-wearos-sensors/internal/messaging/android/result-messaging-service.android";
import { encodeMessage } from "nativescript-wearos-sensors/internal/messaging/messaging-client";

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

export function buildFakeMessageEvent(
    nodeId: string,
    path: string,
    message?: string | number[]
): wearOS.MessageEvent {
    return new wearOS.MessageEvent({
        getData(): native.Array<number> {
            return message ?
                typeof message === "string" ?
                    encodeMessage(message as string) :
                    message :
                null;
        },
        getPath(): string {
            return path;
        },
        getRequestId(): number {
            return 53;
        },
        getSourceNodeId(): string {
            return nodeId;
        }
    });
}

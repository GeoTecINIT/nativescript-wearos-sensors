import { wearOS, WearOsNode } from "nativescript-wearos-sensors/internal/utils/android/wear-os-types.android";
import { MessagingProtocol } from "nativescript-wearos-sensors/internal/communication/messaging";
import { SensorType } from "nativescript-wearos-sensors/internal/sensors/sensor-type";
import { SensorRecord } from "nativescript-wearos-sensors/internal/sensors/sensor-record";
import { MessagingResult } from "nativescript-wearos-sensors/internal/communication/messaging/android/messaging-result-service.android";
import { encodeMessage } from "nativescript-wearos-sensors/internal/communication/encoder-decoder";
import { SensorSample } from "nativescript-wearos-sensors/internal/sensors/sample";

export function buildFakeNode(id: string, name: string, nearby: boolean): WearOsNode {
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
): MessagingResult {
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
            return message || message === "" ?
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

export function buildFakeSensorRecords(type: SensorType, deviceId: string, samples: SensorSample[]): SensorRecord<any> {
    return {
        type,
        deviceId,
        samples,
    }
}

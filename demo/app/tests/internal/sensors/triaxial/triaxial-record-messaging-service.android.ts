import { buildFakeMessageEvent, getFakeMessagingProtocol } from "../../index";
import { TriAxialRecordMessagingService } from "nativescript-wearos-sensors/internal/sensors/triaxial/triaxial-record-messaging-service.android";
import { TriAxialSensorRecord } from "nativescript-wearos-sensors/internal/sensors/triaxial/record";
import { buildFakeEncodedMessage, getFakeTriAxialData } from ".";

describe("TriAxial record messaging service", () => {
    const nodeId = "testNode";
    const protocol = getFakeMessagingProtocol();

    let callbackManager;
    let recordMessagingService: TriAxialRecordMessagingService;

    beforeEach(() => {
        callbackManager = jasmine.createSpyObj("callbackManagerSpy", ['notifyAll']);
        recordMessagingService = new TriAxialRecordMessagingService();
        recordMessagingService.setProtocol(protocol);
        recordMessagingService.setCallbackManager(callbackManager);
        spyOn(recordMessagingService, "decodeRecords").and.callThrough();
    });

    it("does nothing when receives a messages with an unknown protocol", () => {
        const messageEvent = buildFakeMessageEvent(nodeId, "unknownProtocol");
        recordMessagingService.onMessageReceived(messageEvent);

        expect(recordMessagingService.decodeRecords).not.toHaveBeenCalled();
        expect(callbackManager.notifyAll).not.toHaveBeenCalled();
    });

    it("does nothing when receives a messages without data", () => {
        const messageEvent = buildFakeMessageEvent(nodeId, protocol.newRecordMessagePath);
        recordMessagingService.onMessageReceived(messageEvent);

        expect(recordMessagingService.decodeRecords).not.toHaveBeenCalled();
        expect(callbackManager.notifyAll).not.toHaveBeenCalled();
    });

    it("decodes the message data building a new record", () => {
        const expectedRecords: TriAxialSensorRecord[] = [
            {
                deviceId: nodeId,
                ...getFakeTriAxialData()
            },
            {
                deviceId: nodeId,
                ...getFakeTriAxialData()
            },
        ];
        const messageEvent = buildFakeMessageEvent(
            nodeId,
            protocol.newRecordMessagePath,
            buildFakeEncodedMessage(expectedRecords)
        );

        const { records } = recordMessagingService.decodeRecords(messageEvent);
        expect(records.length).toBe(2);
        records.forEach((record, i) => {
            expect(record.deviceId).toEqual(expectedRecords[i].deviceId);
            expect(record.timestamp).toEqual(expectedRecords[i].timestamp);
            expect(record.x).toBeCloseTo(expectedRecords[i].x, 6);
            expect(record.y).toBeCloseTo(expectedRecords[i].y, 6);
            expect(record.z).toBeCloseTo(expectedRecords[i].z, 6);
        })

    });

    it("receives a message, builds a record an notifies it", () => {
        const messageEvent = buildFakeMessageEvent(
            nodeId,
            protocol.newRecordMessagePath,
            buildFakeEncodedMessage([
                {
                    deviceId: nodeId,
                    ...getFakeTriAxialData()
                }
            ])
        );

        recordMessagingService.onMessageReceived(messageEvent);

        expect(recordMessagingService.decodeRecords).toHaveBeenCalledWith(messageEvent);
        expect(callbackManager.notifyAll).toHaveBeenCalled();
    });
})

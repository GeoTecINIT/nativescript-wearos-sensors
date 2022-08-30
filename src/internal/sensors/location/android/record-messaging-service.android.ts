import {
    AbstractRecordMessagingService
} from "../../../communication/messaging/android/abstract-record-messaging-service.android";
import { wearOS } from "../../../utils/android/wear-os-types.android";
import { SensorRecord } from "../../sensor-record";
import { LocationSensorSample } from "../sample";
import { SensorType } from "../../sensor-type";
import { protocols } from "../../../communication/messaging/protocol";
import ByteBuffer = java.nio.ByteBuffer;

export class LocationRecordMessagingService extends AbstractRecordMessagingService {

    constructor() {
        super(protocols.get(SensorType.LOCATION));
    }

    decodeSamples(messageEvent: wearOS.MessageEvent): SensorRecord<LocationSensorSample> {
        const buff = ByteBuffer.wrap(messageEvent.getData());
        const size = buff.getInt();
        let timestamp, latitude, longitude, altitude, verticalAccuracy, horizontalAccuracy, speed, direction;

        const samples: LocationSensorSample[] = [];
        for (let i = 0; i < size; i++) {
            latitude = buff.getDouble();
            longitude = buff.getDouble();
            altitude = buff.getDouble();
            verticalAccuracy = buff.getFloat();
            horizontalAccuracy = buff.getFloat();
            speed = buff.getFloat();
            direction = buff.getFloat();
            timestamp = buff.getLong();

            samples.push({
                timestamp,
                latitude,
                longitude,
                altitude,
                verticalAccuracy,
                horizontalAccuracy,
                speed,
                direction
            });
        }

        return {
            type: SensorType.LOCATION,
            deviceId: messageEvent.getSourceNodeId(),
            samples: samples,
        };
    }
}

let _locationRecordMessagingService;
export function getLocationRecordService(): AbstractRecordMessagingService {
    if (!_locationRecordMessagingService) {
        _locationRecordMessagingService = new LocationRecordMessagingService();
    }
    return _locationRecordMessagingService;
}

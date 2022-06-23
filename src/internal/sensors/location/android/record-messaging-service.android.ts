import { AbstractRecordMessagingService } from "../../../communication/messaging/android/abstract-record-messaging-service.android";
import { wearOS } from "../../../utils/android/wear-os-types.android";
import { SensorRecord } from "../../sensor-record";
import { LocationSensorSample } from "../sample";
import { SensorType } from "../../sensor-type";
import ByteBuffer = java.nio.ByteBuffer;

export class LocationRecordMessagingService extends AbstractRecordMessagingService {

    decodeSamples(messageEvent: wearOS.MessageEvent): SensorRecord<LocationSensorSample> {
        const buff = ByteBuffer.wrap(messageEvent.getData());
        const size = buff.getInt();
        let lat, lon, alt, time;

        const samples: LocationSensorSample[] = [];
        for (let i = 0; i < size; i++) {
            lat = buff.getDouble();
            lon = buff.getDouble();
            alt = buff.getDouble();
            time = buff.getLong();

            samples.push({
                timestamp: time,
                latitude: lat,
                longitude: lon,
                altitude: alt,
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

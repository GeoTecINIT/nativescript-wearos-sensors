import { AbstractRecordMessagingService } from "../../../communication/messaging/android/abstract-record-messaging-service.android";
import { wearOS } from "../../../utils/android/wear-os-types.android";
import { SensorRecords } from "../../sensor-record";
import { LocationSensorRecord } from "../record";
import { SensorType } from "../../sensor-type";
import ByteBuffer = java.nio.ByteBuffer;

export class LocationRecordMessagingService extends AbstractRecordMessagingService {

    decodeRecords(messageEvent: wearOS.MessageEvent): SensorRecords<LocationSensorRecord> {
        const buff = ByteBuffer.wrap(messageEvent.getData());
        const size = buff.getInt();
        let lat, lon, alt, time;

        const records: LocationSensorRecord[] = [];
        for (let i = 0; i < size; i++) {
            lat = buff.getDouble();
            lon = buff.getDouble();
            alt = buff.getDouble();
            time = buff.getLong();

            records.push({
                deviceId: messageEvent.getSourceNodeId(),
                timestamp: new Date(time),
                latitude: lat,
                longitude: lon,
                altitude: alt,
            });
        }

        return {
            type: SensorType.LOCATION,
            records,
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

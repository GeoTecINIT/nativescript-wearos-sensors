import { TriAxialRecordMessagingService } from "../../triaxial-record-messaging-service.android";
import { SensorRecords } from "../../../sensor-record";
import { TriAxialSensorRecord } from "../../record";
import { SensorType } from "../../../sensor-type";
import { AbstractRecordMessagingService } from "../../../../messaging/android/abstract-record-messaging-service.android";

export class MagnetometerRecordMessagingService extends TriAxialRecordMessagingService {

    decodeRecords(messageEvent: com.google.android.gms.wearable.MessageEvent): SensorRecords<TriAxialSensorRecord> {
        const { records } = super.decodeRecords(messageEvent);
        return {
            type: SensorType.MAGNETOMETER,
            records,
        };
    }
}

let _magnetometerRecordService = null;
export function getMagnetometerRecordService(): AbstractRecordMessagingService {
    if (!_magnetometerRecordService) {
        _magnetometerRecordService = new MagnetometerRecordMessagingService();
    }
    return _magnetometerRecordService;
}

import { TriAxialRecordMessagingService } from "../../triaxial-record-messaging-service.android";
import { AbstractRecordMessagingService } from "../../../../communication/messaging/android/abstract-record-messaging-service.android";
import { SensorType } from "../../../sensor-type";
import { SensorRecords } from "../../../sensor-record";
import { TriAxialSensorRecord } from "../../record";

export class AccelerometerRecordMessagingService extends TriAxialRecordMessagingService {

    decodeRecords(messageEvent: com.google.android.gms.wearable.MessageEvent): SensorRecords<TriAxialSensorRecord> {
        const { records } = super.decodeRecords(messageEvent);
        return {
            type: SensorType.ACCELEROMETER,
            records,
        };
    }
}

let _accelerometerRecordService = null;
export function getAccelerometerRecordService(): AbstractRecordMessagingService {
    if (!_accelerometerRecordService) {
        _accelerometerRecordService = new AccelerometerRecordMessagingService();
    }
    return _accelerometerRecordService;
}

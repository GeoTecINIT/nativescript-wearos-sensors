import { TriAxialRecordMessagingService } from "../../triaxial-record-messaging-service.android";
import { AccelerometerSensorRecord } from "../record";
import { AbstractRecordMessagingService } from "../../../../messaging/android/abstract-record-messaging-service.android";

export class AccelerometerRecordMessagingService extends TriAxialRecordMessagingService {

    decodeRecords(messageEvent: com.google.android.gms.wearable.MessageEvent): AccelerometerSensorRecord[] {
        const decodedRecords = super.decodeRecords(messageEvent);
        return decodedRecords as AccelerometerSensorRecord[];
    }
}

let _accelerometerRecordService = null;
export function getAccelerometerRecordService(): AbstractRecordMessagingService<AccelerometerSensorRecord> {
    if (!_accelerometerRecordService) {
        _accelerometerRecordService = new AccelerometerRecordMessagingService();
    }
    return _accelerometerRecordService;
}

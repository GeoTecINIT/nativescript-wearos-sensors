import { TriAxialRecordMessagingService } from "../../accelerometer/android/triaxial-record-messaging-service.android";
import { GyroscopeSensorRecord} from "../record";
import { AbstractRecordMessagingService } from "../../messaging/android/abstract-record-messaging-service.android";

export class GyroscopeRecordMessagingService extends TriAxialRecordMessagingService {

    decodeRecords(messageEvent: com.google.android.gms.wearable.MessageEvent): GyroscopeSensorRecord[] {
        const decodedRecords = super.decodeRecords(messageEvent);
        return decodedRecords as GyroscopeSensorRecord[];
    }
}

let _gyroscopeRecordService = null;
export function getGyroscopeRecordService(): AbstractRecordMessagingService<GyroscopeSensorRecord> {
    if (!_gyroscopeRecordService) {
        _gyroscopeRecordService = new GyroscopeRecordMessagingService();
    }
    return _gyroscopeRecordService;
}

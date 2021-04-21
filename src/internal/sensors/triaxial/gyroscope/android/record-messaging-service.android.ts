import { TriAxialRecordMessagingService } from "../../triaxial-record-messaging-service.android";
import { AbstractRecordMessagingService } from "../../../../messaging/android/abstract-record-messaging-service.android";
import { SensorRecords } from "../../../sensor-record";
import { SensorType } from "../../../sensor-type";
import {TriAxialSensorRecord} from "../../record";

export class GyroscopeRecordMessagingService extends TriAxialRecordMessagingService {

    decodeRecords(messageEvent: com.google.android.gms.wearable.MessageEvent): SensorRecords<TriAxialSensorRecord> {
        const { records } = super.decodeRecords(messageEvent);
        return {
            type: SensorType.GYROSCOPE,
            records,
        };
    }
}

let _gyroscopeRecordService = null;
export function getGyroscopeRecordService(): AbstractRecordMessagingService {
    if (!_gyroscopeRecordService) {
        _gyroscopeRecordService = new GyroscopeRecordMessagingService();
    }
    return _gyroscopeRecordService;
}

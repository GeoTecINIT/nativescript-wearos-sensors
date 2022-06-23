import { TriAxialRecordMessagingService } from "../../triaxial-record-messaging-service.android";
import { AbstractRecordMessagingService } from "../../../../communication/messaging/android/abstract-record-messaging-service.android";
import { SensorRecord } from "../../../sensor-record";
import { SensorType } from "../../../sensor-type";
import {TriAxialSensorSample} from "../../sample";

export class GyroscopeRecordMessagingService extends TriAxialRecordMessagingService {

    decodeSamples(messageEvent: com.google.android.gms.wearable.MessageEvent): SensorRecord<TriAxialSensorSample> {
        const { deviceId, samples } = super.decodeSamples(messageEvent);
        return {
            type: SensorType.GYROSCOPE,
            deviceId: deviceId,
            samples: samples,
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

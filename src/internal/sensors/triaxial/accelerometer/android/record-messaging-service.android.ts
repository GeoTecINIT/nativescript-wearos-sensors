import { TriAxialRecordMessagingService } from "../../triaxial-record-messaging-service.android";
import { AbstractRecordMessagingService } from "../../../../communication/messaging/android/abstract-record-messaging-service.android";
import { SensorType } from "../../../sensor-type";
import { SensorRecord } from "../../../sensor-record";
import { TriAxialSensorSample } from "../../sample";

export class AccelerometerRecordMessagingService extends TriAxialRecordMessagingService {

    decodeSamples(messageEvent: com.google.android.gms.wearable.MessageEvent): SensorRecord<TriAxialSensorSample> {
        const { deviceId, samples } = super.decodeSamples(messageEvent);
        return {
            type: SensorType.ACCELEROMETER,
            deviceId: deviceId,
            samples: samples,
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

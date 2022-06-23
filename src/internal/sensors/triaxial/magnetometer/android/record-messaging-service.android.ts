import { TriAxialRecordMessagingService } from "../../triaxial-record-messaging-service.android";
import { SensorRecord } from "../../../sensor-record";
import { TriAxialSensorSample } from "../../sample";
import { SensorType } from "../../../sensor-type";
import { AbstractRecordMessagingService } from "../../../../communication/messaging/android/abstract-record-messaging-service.android";

export class MagnetometerRecordMessagingService extends TriAxialRecordMessagingService {

    decodeSamples(messageEvent: com.google.android.gms.wearable.MessageEvent): SensorRecord<TriAxialSensorSample> {
        const { deviceId, samples } = super.decodeSamples(messageEvent);
        return {
            type: SensorType.MAGNETOMETER,
            deviceId: deviceId,
            samples: samples,
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

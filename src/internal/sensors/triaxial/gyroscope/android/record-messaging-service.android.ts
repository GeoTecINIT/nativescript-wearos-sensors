import { TriAxialRecordMessagingService } from "../../triaxial-record-messaging-service.android";
import {
    AbstractRecordMessagingService
} from "../../../../communication/messaging/android/abstract-record-messaging-service.android";
import { SensorRecord } from "../../../sensor-record";
import { SensorType } from "../../../sensor-type";
import { TriAxialSensorSample } from "../../sample";
import { protocols } from "../../../../communication/messaging/protocol";

export class GyroscopeRecordMessagingService extends TriAxialRecordMessagingService {

    constructor() {
        super(protocols.get(SensorType.GYROSCOPE));
    }

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

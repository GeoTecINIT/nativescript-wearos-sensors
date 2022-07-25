package es.uji.geotec.wearossensors.records.accumulator;


import es.uji.geotec.wearossensors.records.HeartRateRecord;
import es.uji.geotec.wearossensors.records.LocationRecord;
import es.uji.geotec.wearossensors.records.TriAxialRecord;
import es.uji.geotec.wearossensors.records.callbacks.AbstractRecordCallback;
import es.uji.geotec.wearossensors.sensoring.WearSensor;

public class RecordAccumulatorProvider {
    private RecordAccumulatorProvider() {}

    public static RecordAccumulator getRecordAccumulatorProviderFor(WearSensor wearSensor, AbstractRecordCallback callback, int limit) {
        switch (wearSensor) {
            case ACCELEROMETER:
            case GYROSCOPE:
            case MAGNETOMETER:
                return new RecordAccumulator<TriAxialRecord>(callback, limit);
            case HEART_RATE:
                return new RecordAccumulator<HeartRateRecord>(callback, limit);
            case LOCATION:
                return new RecordAccumulator<LocationRecord>(callback, limit);
            default:
                return null;
        }
    }
}

package org.nativescript.demo.records.accumulator;

import org.nativescript.demo.records.TriAxialRecord;
import org.nativescript.demo.records.callbacks.AbstractRecordCallback;
import org.nativescript.demo.sensoring.WearSensor;

public class RecordAccumulatorProvider {
    private RecordAccumulatorProvider() {}

    public static RecordAccumulator getRecordAccumulatorProviderFor(WearSensor wearSensor, AbstractRecordCallback callback, int limit) {
        switch (wearSensor) {
            case ACCELEROMETER:
            case GYROSCOPE:
                return new RecordAccumulator<TriAxialRecord>(callback, limit);
            default:
                return null;
        }
    }
}

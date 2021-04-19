package org.nativescript.demo.records.accumulator;

import org.nativescript.demo.records.AccelerometerRecord;
import org.nativescript.demo.records.callbacks.AbstractRecordCallback;
import org.nativescript.demo.sensoring.WearSensor;

public class RecordAccumulatorProvider {
    private RecordAccumulatorProvider() {}

    public static RecordAccumulator getRecordAccumulatorProviderFor(WearSensor wearSensor, AbstractRecordCallback callback, int limit) {
        switch (wearSensor) {
            case ACCELEROMETER:
                return new RecordAccumulator<AccelerometerRecord>(callback, limit);
            default:
                return null;
        }
    }
}

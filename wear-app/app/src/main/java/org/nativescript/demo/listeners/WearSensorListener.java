package org.nativescript.demo.listeners;

import android.hardware.SensorEventListener;

import org.nativescript.demo.records.accumulator.RecordAccumulator;
import org.nativescript.demo.records.callbacks.AbstractRecordCallback;

public interface WearSensorListener extends SensorEventListener {
    void setRecordAccumulator(RecordAccumulator callback);
}

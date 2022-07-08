package es.uji.geotec.wearossensors.listeners;

import android.hardware.SensorEventListener;

import es.uji.geotec.wearossensors.records.accumulator.RecordAccumulator;

public interface WearSensorListener extends SensorEventListener {
    void setRecordAccumulator(RecordAccumulator callback);
}

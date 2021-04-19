package org.nativescript.demo.listeners;

import android.hardware.Sensor;
import android.hardware.SensorEvent;

import org.nativescript.demo.records.accumulator.RecordAccumulator;
import org.nativescript.demo.sensoring.WearSensor;
import org.nativescript.demo.records.AccelerometerRecord;

public class AccelerometerSensorListener implements WearSensorListener {

    private static AccelerometerSensorListener instance;

    private RecordAccumulator accumulator;

    private AccelerometerSensorListener() {}

    public static AccelerometerSensorListener getInstance() {
        if (instance == null)
            instance = new AccelerometerSensorListener();
        return instance;
    }

    @Override
    public void setRecordAccumulator(RecordAccumulator accumulator) {
        this.accumulator = accumulator;
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() != WearSensor.ACCELEROMETER.getSensorType())
            return;

        float xValue = event.values[0];
        float yValue = event.values[1];
        float zValue = event.values[2];

        AccelerometerRecord record = new AccelerometerRecord(System.currentTimeMillis(), xValue, yValue, zValue);
       accumulator.accumulateRecord(record);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }
}

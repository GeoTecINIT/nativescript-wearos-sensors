package org.nativescript.demo.listeners_notifiers;

import android.hardware.Sensor;
import android.hardware.SensorEvent;

import org.nativescript.demo.sensoring.WearSensor;
import org.nativescript.demo.records.AccelerometerRecord;
import org.nativescript.demo.records.callbacks.AbstractRecordCallback;

public class AccelerometerSensorListenerAndNotifier implements SensorListenerAndNotifier {

    private static AccelerometerSensorListenerAndNotifier instance;

    private AbstractRecordCallback callback;

    private AccelerometerSensorListenerAndNotifier() {}

    public static AccelerometerSensorListenerAndNotifier getInstance() {
        if (instance == null)
            instance = new AccelerometerSensorListenerAndNotifier();
        return instance;
    }

    @Override
    public void setNewRecordCallback(AbstractRecordCallback callback) {
        this.callback = callback;
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() != WearSensor.ACCELEROMETER.getSensorType())
            return;

        float xValue = event.values[0];
        float yValue = event.values[1];
        float zValue = event.values[2];

        AccelerometerRecord record = new AccelerometerRecord(System.currentTimeMillis(), xValue, yValue, zValue);
        callback.onRecordCollected(record);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }
}

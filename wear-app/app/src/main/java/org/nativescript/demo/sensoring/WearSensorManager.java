package org.nativescript.demo.sensoring;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

public class WearSensorManager {

    private SensorManager sensorManager;

    public WearSensorManager(Context context) {
        this.sensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
    }

    public boolean isSensorAvailable(WearSensor sensor) {
        return  getWearSensor(sensor) != null;
    }

    public boolean startCollectingFrom(WearSensor wearSensor, SensorEventListener listener) {
        if (!isSensorAvailable(wearSensor) || listener == null)
            return false;

        Sensor sensor = getWearSensor(wearSensor);
        return sensorManager.registerListener(listener, sensor, SensorManager.SENSOR_DELAY_NORMAL);
    }

    public void stopCollectingFrom(WearSensor wearSensor, SensorEventListener listener) {
        if (listener == null)
            return;

        Sensor sensor = getWearSensor(wearSensor);
        sensorManager.unregisterListener(listener, sensor);
    }

    private Sensor getWearSensor(WearSensor sensor) {
        return sensorManager.getDefaultSensor(sensor.getSensorType());
    }
}

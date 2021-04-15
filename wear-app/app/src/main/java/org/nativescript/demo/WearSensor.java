package org.nativescript.demo;

import android.hardware.Sensor;

public enum WearSensor {
    ACCELEROMETER(Sensor.TYPE_ACCELEROMETER);

    private int sensorType;
    WearSensor(int sensorType) {
        this.sensorType = sensorType;
    }

    public int getSensorType() {
        return sensorType;
    }
}

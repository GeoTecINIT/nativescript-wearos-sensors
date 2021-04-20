package org.nativescript.demo.sensoring;

import android.hardware.Sensor;

public enum WearSensor {
    ACCELEROMETER(Sensor.TYPE_ACCELEROMETER),
    GYROSCOPE(Sensor.TYPE_GYROSCOPE);

    private int sensorType;
    WearSensor(int sensorType) {
        this.sensorType = sensorType;
    }

    public int getSensorType() {
        return sensorType;
    }
}

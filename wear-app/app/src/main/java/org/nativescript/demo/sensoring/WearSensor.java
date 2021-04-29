package org.nativescript.demo.sensoring;

import android.content.pm.PackageManager;
import android.hardware.Sensor;

public enum WearSensor {
    ACCELEROMETER(PackageManager.FEATURE_SENSOR_ACCELEROMETER, Sensor.TYPE_ACCELEROMETER),
    GYROSCOPE(PackageManager.FEATURE_SENSOR_GYROSCOPE, Sensor.TYPE_GYROSCOPE),
    MAGNETOMETER(PackageManager.FEATURE_SENSOR_COMPASS, Sensor.TYPE_MAGNETIC_FIELD),
    LOCATION(PackageManager.FEATURE_LOCATION_GPS, -1);

    private String feature;
    private int sensorType;
    WearSensor(String feature, int sensorType) {
        this.feature = feature;
        this.sensorType = sensorType;
    }

    public String getSensorFeature() {
        return feature;
    }

    public int getSensorType() {
        return sensorType;
    }
}

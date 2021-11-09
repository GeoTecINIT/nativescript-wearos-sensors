package org.nativescript.demo.sensoring;

import android.hardware.SensorManager;

public class SensoringConfiguration {

    private static final int DEFAULT_SENSOR_DELAY = SensorManager.SENSOR_DELAY_NORMAL;
    private static final int DEFAULT_BATCH_SIZE = 50;

    private WearSensor wearSensor;
    private String requesterId;
    private String sendingPath;
    private int sensorDelay;
    private int batchSize;

    public SensoringConfiguration(WearSensor wearSensor, String requesterId, String sendingPath, int sensorDelay, int batchSize) {
        this.wearSensor = wearSensor;
        this.requesterId = requesterId;
        this.sendingPath = sendingPath;
        this.sensorDelay = sensorDelay;
        this.batchSize = batchSize;
    }

    public WearSensor getWearSensor() {
        return wearSensor;
    }

    public String getRequesterId() {
        return requesterId;
    }

    public String getSendingPath() {
        return sendingPath;
    }

    public int getSensorDelay() {
        if (sensorDelay == -1)
            return DEFAULT_SENSOR_DELAY;
        return sensorDelay;
    }

    public int getBatchSize() {
        if (batchSize == -1)
            return DEFAULT_BATCH_SIZE;
        return batchSize;
    }
}

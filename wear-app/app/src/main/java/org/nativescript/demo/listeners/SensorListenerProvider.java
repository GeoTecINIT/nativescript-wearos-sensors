package org.nativescript.demo.listeners;

import org.nativescript.demo.sensoring.WearSensor;

public class SensorListenerProvider {
    private SensorListenerProvider() {
    }

    public static WearSensorListener getListenerAndNotifierFor(WearSensor wearSensor) {
        switch (wearSensor) {
            case ACCELEROMETER:
                return AccelerometerSensorListener.getInstance();
            default:
                return null;
        }
    }
}

package org.nativescript.demo.listeners_notifiers;

import org.nativescript.demo.sensoring.WearSensor;

public class SensorListenerAndNotifierProvider {
    private SensorListenerAndNotifierProvider() {
    }

    public static SensorListenerAndNotifier getListenerAndNotifierFor(WearSensor wearSensor) {
        switch (wearSensor) {
            case ACCELEROMETER:
                return AccelerometerSensorListenerAndNotifier.getInstance();
            default:
                return null;
        }
    }
}

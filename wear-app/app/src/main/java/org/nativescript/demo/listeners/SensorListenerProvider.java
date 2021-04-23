package org.nativescript.demo.listeners;

import android.hardware.SensorEventListener;

import org.nativescript.demo.records.accumulator.RecordAccumulator;
import org.nativescript.demo.sensoring.WearSensor;

public class SensorListenerProvider {
    private SensorListenerProvider() {
    }

    public static SensorEventListener getListenerAndNotifierFor(
            WearSensor wearSensor,
            RecordAccumulator recordAccumulator
    ) {
        switch (wearSensor) {
            case ACCELEROMETER:
            case GYROSCOPE:
            case MAGNETOMETER:
                return new TriAxialSensorListener(wearSensor, recordAccumulator);
            default:
                return null;
        }
    }
}

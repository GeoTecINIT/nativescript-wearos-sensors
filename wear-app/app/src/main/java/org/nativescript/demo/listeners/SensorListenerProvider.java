package org.nativescript.demo.listeners;

import android.hardware.SensorEventListener;

import com.google.android.gms.location.LocationCallback;

import org.nativescript.demo.records.accumulator.RecordAccumulator;
import org.nativescript.demo.sensoring.WearSensor;

public class SensorListenerProvider {
    private SensorListenerProvider() {
    }

    public static SensorEventListener getListenerFor(
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

    public static LocationCallback getLocationListener(RecordAccumulator recordAccumulator) {
        return new LocationSensorListener(recordAccumulator);
    }
}

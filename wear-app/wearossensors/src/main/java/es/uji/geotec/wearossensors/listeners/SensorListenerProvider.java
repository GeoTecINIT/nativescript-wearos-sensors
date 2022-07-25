package es.uji.geotec.wearossensors.listeners;

import android.hardware.SensorEventListener;

import com.google.android.gms.location.LocationCallback;

import es.uji.geotec.wearossensors.records.accumulator.RecordAccumulator;
import es.uji.geotec.wearossensors.sensoring.WearSensor;

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
            case HEART_RATE:
                return new HeartRateSensorListener(recordAccumulator);
            default:
                return null;
        }
    }

    public static LocationCallback getLocationListener(RecordAccumulator recordAccumulator) {
        return new LocationSensorListener(recordAccumulator);
    }
}

package org.nativescript.demo.sensoring;

import android.content.Context;
import android.hardware.SensorEventListener;

import com.google.android.gms.location.LocationCallback;

import org.nativescript.demo.listeners.SensorListenerProvider;
import org.nativescript.demo.records.accumulator.RecordAccumulator;
import org.nativescript.demo.records.accumulator.RecordAccumulatorProvider;
import org.nativescript.demo.records.callbacks.AbstractRecordCallback;
import org.nativescript.demo.records.callbacks.RecordCallbackProvider;

import java.util.HashMap;

public class CollectorManager {

    private Context context;
    private WearSensorManager wearSensorManager;

    private HashMap<WearSensor, SensorEventListener> listeners;
    private LocationCallback locationListener;

    public CollectorManager(Context context) {
        this.context = context;
        this.wearSensorManager = new WearSensorManager(context);
        this.listeners = new HashMap<>();
    }

    public boolean startCollectingFrom(WearSensor wearSensor, String requesterId, String sendingPath) {
        AbstractRecordCallback callback = RecordCallbackProvider.getRecordCallbackFor(
                wearSensor,
                context,
                requesterId,
                sendingPath
        );

        RecordAccumulator accumulator = RecordAccumulatorProvider.getRecordAccumulatorProviderFor(
                wearSensor,
                callback,
                wearSensor == WearSensor.LOCATION ? 1 : 50);

        switch (wearSensor) {
            case ACCELEROMETER:
            case GYROSCOPE:
            case MAGNETOMETER:
                SensorEventListener listener = SensorListenerProvider.getListenerFor(wearSensor, accumulator);
                if (listener == null)
                    return false;

                listeners.put(wearSensor, listener);
                return wearSensorManager.startCollectingFrom(wearSensor, listener);
            case LOCATION:
                locationListener = SensorListenerProvider.getLocationListener(accumulator);
                if (locationListener == null)
                    return false;

                return wearSensorManager.startCollectingLocations(locationListener);
            default:
                return false;
        }
    }

    public void stopCollectingFrom(WearSensor wearSensor) {
        switch (wearSensor) {
            case ACCELEROMETER:
            case GYROSCOPE:
            case MAGNETOMETER:
                SensorEventListener listener = listeners.get(wearSensor);
                if (listener == null)
                    return;

                listeners.remove(wearSensor);
                wearSensorManager.stopCollectingFrom(wearSensor, listener);
                break;
            case LOCATION:
                if (locationListener == null)
                    return;

                wearSensorManager.stopCollectingLocations(locationListener);
                locationListener = null;
                break;
        }
    }
}

package es.uji.geotec.wearossensors.sensoring;

import android.content.Context;
import android.hardware.SensorEventListener;

import com.google.android.gms.location.LocationCallback;

import java.util.HashMap;

import es.uji.geotec.wearossensors.listeners.SensorListenerProvider;
import es.uji.geotec.wearossensors.records.accumulator.RecordAccumulator;
import es.uji.geotec.wearossensors.records.accumulator.RecordAccumulatorProvider;
import es.uji.geotec.wearossensors.records.callbacks.AbstractRecordCallback;
import es.uji.geotec.wearossensors.records.callbacks.RecordCallbackProvider;

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

    public boolean startCollectingFrom(SensoringConfiguration sensoringConfiguration) {
        WearSensor wearSensor = sensoringConfiguration.getWearSensor();
        AbstractRecordCallback callback = RecordCallbackProvider.getRecordCallbackFor(
                wearSensor,
                context,
                sensoringConfiguration.getRequesterId(),
                sensoringConfiguration.getSendingPath()
        );

        RecordAccumulator accumulator = RecordAccumulatorProvider.getRecordAccumulatorProviderFor(
                wearSensor,
                callback,
                sensoringConfiguration.getBatchSize()
        );

        switch (wearSensor) {
            case ACCELEROMETER:
            case GYROSCOPE:
            case MAGNETOMETER:
            case HEART_RATE:
                SensorEventListener listener = SensorListenerProvider.getListenerFor(wearSensor, accumulator);
                if (listener == null)
                    return false;

                listeners.put(wearSensor, listener);
                return wearSensorManager.startCollectingFrom(wearSensor, sensoringConfiguration.getSensorDelay(), listener);
            case LOCATION:
                locationListener = SensorListenerProvider.getLocationListener(accumulator);
                if (locationListener == null)
                    return false;

                return wearSensorManager.startCollectingLocations(locationListener, sensoringConfiguration.getSensorDelay());
            default:
                return false;
        }
    }

    public void stopCollectingFrom(WearSensor wearSensor) {
        switch (wearSensor) {
            case ACCELEROMETER:
            case GYROSCOPE:
            case MAGNETOMETER:
            case HEART_RATE:
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

    public void ensureStopCollecting() {
        wearSensorManager.stopCollectingFromAllSources(listeners, locationListener);
    }
}

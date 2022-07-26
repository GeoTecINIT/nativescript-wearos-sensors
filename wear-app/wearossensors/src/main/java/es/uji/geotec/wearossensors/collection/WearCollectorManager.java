package es.uji.geotec.wearossensors.collection;

import android.annotation.SuppressLint;
import android.content.Context;
import android.hardware.SensorEventListener;

import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.Priority;

import java.util.Arrays;

import es.uji.geotec.backgroundsensors.collection.CollectionConfiguration;
import es.uji.geotec.backgroundsensors.collection.CollectorManager;
import es.uji.geotec.backgroundsensors.record.accumulator.RecordAccumulator;
import es.uji.geotec.backgroundsensors.record.callback.RecordCallback;
import es.uji.geotec.backgroundsensors.sensor.Sensor;
import es.uji.geotec.wearossensors.listeners.SensorListenerProvider;
import es.uji.geotec.wearossensors.sensor.WearSensor;

public class WearCollectorManager extends CollectorManager {

    private LocationCallback locationListener;

    public WearCollectorManager(Context context) {
        super(context, Arrays.asList(WearSensor.values()));
    }

    @SuppressLint("MissingPermission")
    @Override
    public boolean startCollectingFrom(
        CollectionConfiguration collectionConfiguration,
        RecordCallback recordCallback
    ) {
        WearSensor sensor = (WearSensor) collectionConfiguration.getSensor();

        if (!isSensorAvailable(sensor))
            return false;

        RecordAccumulator accumulator = new RecordAccumulator(
            recordCallback,
            collectionConfiguration.getBatchSize()
        );

        switch(sensor) {
            case ACCELEROMETER:
            case GYROSCOPE:
            case MAGNETOMETER:
            case HEART_RATE:
                SensorEventListener listener = SensorListenerProvider.getListenerFor(sensor, accumulator);
                if (listener == null)
                    return false;

                listeners.put(sensor, listener);

                android.hardware.Sensor androidSensor = this.getAndroidSensor(sensor);
                return sensorManager.registerListener(
                        listener,
                        androidSensor,
                        collectionConfiguration.getSensorDelay()
                );
            case LOCATION:
                locationListener = SensorListenerProvider.getLocationListener(accumulator);
                if (locationListener == null)
                    return false;

                LocationRequest request = LocationRequest.create()
                        .setPriority(Priority.PRIORITY_HIGH_ACCURACY)
                        .setInterval(collectionConfiguration.getSensorDelay());

                LocationServices.getFusedLocationProviderClient(context)
                        .requestLocationUpdates(request, locationListener, null);
                return true;
            default:
                return false;
        }
    }

    @Override
    public void stopCollectingFrom(Sensor sensor) {
        switch ((WearSensor) sensor) {
            case ACCELEROMETER:
            case GYROSCOPE:
            case MAGNETOMETER:
            case HEART_RATE:
                SensorEventListener listener = listeners.get(sensor);
                if (listener == null)
                    return;

                listeners.remove(sensor);
                android.hardware.Sensor androidSensor = this.getAndroidSensor(sensor);
                sensorManager.unregisterListener(listener, androidSensor);
                return;
            case LOCATION:
                if (locationListener == null)
                    return;

                LocationServices.getFusedLocationProviderClient(context)
                        .removeLocationUpdates(locationListener);

                locationListener = null;
        }

    }

    @Override
    public void ensureStopCollecting() {
        for (Sensor sensor : listeners.keySet()) {
            stopCollectingFrom(sensor);
        }
    }
}

package org.nativescript.demo.sensoring;

import android.annotation.SuppressLint;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;

public class WearSensorManager {

    private Context context;
    private SensorManager sensorManager;

    public WearSensorManager(Context context) {
        this.context = context;
        this.sensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
    }

    public boolean isSensorAvailable(WearSensor sensor) {
        return context.getPackageManager().hasSystemFeature(sensor.getSensorFeature());
    }

    public boolean startCollectingFrom(WearSensor wearSensor, SensorEventListener listener) {
        if (!isSensorAvailable(wearSensor) || listener == null)
            return false;

        Sensor sensor = getWearSensor(wearSensor);
        return sensorManager.registerListener(listener, sensor, SensorManager.SENSOR_DELAY_NORMAL);
    }

    @SuppressLint("MissingPermission")
    public boolean startCollectingLocations(LocationCallback listener) {
        if (!isSensorAvailable(WearSensor.LOCATION) || listener == null)
            return false;

        LocationRequest request = LocationRequest.create()
                .setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY)
                .setInterval(1000);

        LocationServices.getFusedLocationProviderClient(context)
                .requestLocationUpdates(request, listener, null);

        //FIXME: return result of request
        return true;
    }

    public void stopCollectingFrom(WearSensor wearSensor, SensorEventListener listener) {
        if (listener == null)
            return;

        Sensor sensor = getWearSensor(wearSensor);
        sensorManager.unregisterListener(listener, sensor);
    }

    public void stopCollectingLocations(LocationCallback listener) {
        if (listener == null)
            return;

        LocationServices.getFusedLocationProviderClient(context)
                .removeLocationUpdates(listener);
    }

    private Sensor getWearSensor(WearSensor sensor) {
        return sensorManager.getDefaultSensor(sensor.getSensorType());
    }
}

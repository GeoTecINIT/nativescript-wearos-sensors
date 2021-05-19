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
        boolean hasFeature = context.getPackageManager().hasSystemFeature(sensor.getSensorFeature());

        // Heart rate appears to be not available as system feature in the emulator
        // but it is available from the sensor manager. This is probably due to the
        // recent inclusion of this sensor in the emulator.
        // TODO: check in the future if the heart rate is available as system feature to undo this patch
        int sensorType = sensor.getSensorType();
        if (sensorType == -1)
            return hasFeature;

        boolean hasSensor = sensorManager.getDefaultSensor(sensor.getSensorType()) != null;

        return hasFeature || hasSensor;
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

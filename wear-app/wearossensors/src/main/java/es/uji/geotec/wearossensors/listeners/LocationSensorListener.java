package es.uji.geotec.wearossensors.listeners;

import android.location.Location;

import com.google.android.gms.location.LocationAvailability;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationResult;

import es.uji.geotec.wearossensors.records.LocationRecord;
import es.uji.geotec.wearossensors.records.accumulator.RecordAccumulator;

public class LocationSensorListener extends LocationCallback {

    private RecordAccumulator accumulator;

    public LocationSensorListener(RecordAccumulator accumulator) {
        this.accumulator = accumulator;
    }

    @Override
    public void onLocationResult(LocationResult locationResult) {
        for (Location location : locationResult.getLocations()) {
            LocationRecord record = new LocationRecord(location);
            accumulator.accumulateRecord(record);
        }
    }

    @Override
    public void onLocationAvailability(LocationAvailability locationAvailability) {

    }
}

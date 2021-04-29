package org.nativescript.demo.records;

import android.location.Location;

public class LocationRecord extends Record {

    private double latitude;
    private double longitude;
    private double altitude;

    public LocationRecord(long timestamp, double latitude, double longitude, double altitude) {
        super(timestamp);
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
    }

    public LocationRecord(Location location) {
        super(location.getTime());
        this.latitude = location.getLatitude();
        this.longitude = location.getLongitude();
        this.altitude = location.getAltitude();
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public double getAltitude() {
        return altitude;
    }
}

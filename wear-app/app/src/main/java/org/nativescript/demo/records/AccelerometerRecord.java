package org.nativescript.demo.records;

import org.nativescript.demo.records.Record;

public class AccelerometerRecord extends Record {

    private float x, y, z;

    public AccelerometerRecord(long timestamp, float x, float y, float z) {
        super(timestamp);
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public float getX() {
        return x;
    }

    public float getY() {
        return y;
    }

    public float getZ() {
        return z;
    }
}

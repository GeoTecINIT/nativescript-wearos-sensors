package org.nativescript.demo.records;

public class HeartRateRecord extends Record {

    private int value;

    public HeartRateRecord(long timestamp, int value) {
        super(timestamp);
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}

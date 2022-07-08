package es.uji.geotec.wearossensors.records;

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

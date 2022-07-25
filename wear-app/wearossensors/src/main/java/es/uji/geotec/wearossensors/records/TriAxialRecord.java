package es.uji.geotec.wearossensors.records;

public class TriAxialRecord extends Record {

    private float x, y, z;

    public TriAxialRecord(long timestamp, float x, float y, float z) {
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

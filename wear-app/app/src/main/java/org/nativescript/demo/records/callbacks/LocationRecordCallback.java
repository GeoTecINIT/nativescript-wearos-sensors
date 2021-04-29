package org.nativescript.demo.records.callbacks;

import android.content.Context;

import org.nativescript.demo.records.LocationRecord;

import java.nio.ByteBuffer;
import java.util.List;

public class LocationRecordCallback extends AbstractRecordCallback<LocationRecord> {

    public LocationRecordCallback(Context context, String sourceNodeId, String path) {
        super(context, sourceNodeId, path);
    }

    @Override
    protected byte[] encodeRecords(List<LocationRecord> records) {
        int size = records.size();
        byte[] bytes = new byte[Integer.BYTES + (Double.BYTES * 3 + Long.BYTES) * size];

        ByteBuffer buff = ByteBuffer.wrap(bytes);
        buff.putInt(size);
        for (LocationRecord record : records) {
            buff.putDouble(record.getLatitude());
            buff.putDouble(record.getLongitude());
            buff.putDouble(record.getAltitude());
            buff.putLong(record.getTimestamp());
        }

        return bytes;
    }
}

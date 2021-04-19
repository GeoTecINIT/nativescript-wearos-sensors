package org.nativescript.demo.records.callbacks;

import android.content.Context;

import org.nativescript.demo.records.AccelerometerRecord;

import java.nio.ByteBuffer;
import java.util.List;


public class AccelerometerRecordCallback extends AbstractRecordCallback<AccelerometerRecord> {

    public AccelerometerRecordCallback(Context context, String sourceNodeId, String path) {
        super(context, sourceNodeId, path);
    }

    @Override
    protected byte[] encodeRecords(List<AccelerometerRecord> records) {
        int size = records.size();
        byte[] bytes = new byte[Integer.BYTES + (Float.BYTES * 3 + Long.BYTES) * size];

        ByteBuffer buff = ByteBuffer.wrap(bytes);
        buff.putInt(size);
        for (AccelerometerRecord record : records) {
            buff.putFloat(record.getX());
            buff.putFloat(record.getY());
            buff.putFloat(record.getZ());
            buff.putLong(record.getTimestamp());
        }

        return bytes;
    }
}

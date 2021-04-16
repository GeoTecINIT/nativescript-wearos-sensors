package org.nativescript.demo.records.callbacks;

import android.content.Context;

import org.nativescript.demo.records.callbacks.AbstractRecordCallback;
import org.nativescript.demo.records.AccelerometerRecord;

import java.nio.ByteBuffer;


public class AccelerometerRecordCallback extends AbstractRecordCallback<AccelerometerRecord> {

    public AccelerometerRecordCallback(Context context, String sourceNodeId, String path) {
        super(context, sourceNodeId, path);
    }

    @Override
    protected byte[] encodeRecord(AccelerometerRecord record) {
        byte bytes[] = new byte[(Float.BYTES * 3 + Long.BYTES)];

        ByteBuffer buff = ByteBuffer.wrap(bytes);
        buff.putFloat(record.getX());
        buff.putFloat(record.getY());
        buff.putFloat(record.getZ());
        buff.putLong(record.getTimestamp());

        return bytes;
    }
}

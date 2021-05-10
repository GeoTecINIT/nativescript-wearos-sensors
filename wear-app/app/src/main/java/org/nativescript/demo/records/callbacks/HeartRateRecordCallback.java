package org.nativescript.demo.records.callbacks;

import android.content.Context;

import org.nativescript.demo.records.HeartRateRecord;

import java.nio.ByteBuffer;
import java.util.List;

public class HeartRateRecordCallback extends AbstractRecordCallback<HeartRateRecord> {

    public HeartRateRecordCallback(Context context, String sourceNodeId, String path) {
        super(context, sourceNodeId, path);
    }

    @Override
    protected byte[] encodeRecords(List<HeartRateRecord> records) {
        int size = records.size();
        byte[] bytes = new byte[Integer.BYTES + (Integer.BYTES + Long.BYTES) * size];

        ByteBuffer buff = ByteBuffer.wrap(bytes);
        buff.putInt(size);
        for (HeartRateRecord record : records) {
            buff.putInt(record.getValue());
            buff.putLong(record.getTimestamp());
        }

        return bytes;
    }
}

package org.nativescript.demo.records.accumulator;

import org.nativescript.demo.records.Record;
import org.nativescript.demo.records.callbacks.AbstractRecordCallback;

import java.util.LinkedList;
import java.util.List;

public class RecordAccumulator<T extends Record> {

    private AbstractRecordCallback<T> callback;
    private int limit;
    private List<T> records;

    public RecordAccumulator(AbstractRecordCallback<T> callback, int limit) {
        this.callback = callback;
        this.limit = limit;
        this.records = new LinkedList<>();
    }

    public void accumulateRecord(T record) {
        records.add(record);

        if (records.size() == limit) {
            callback.onRecordsCollected(new LinkedList<T>(records));
            records.clear();
        }
    }
}

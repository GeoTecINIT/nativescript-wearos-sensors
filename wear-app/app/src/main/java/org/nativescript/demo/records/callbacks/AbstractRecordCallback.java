package org.nativescript.demo.records.callbacks;

import android.content.Context;

import org.nativescript.demo.records.Record;
import org.nativescript.demo.messaging.MessagingClient;

import java.util.List;

public abstract class AbstractRecordCallback<T extends Record> {

    private MessagingClient messagingClient;
    private String requesterId;
    private String sendingPath;

    public AbstractRecordCallback(Context context, String requesterId, String sendingPath) {
        this.messagingClient = new MessagingClient(context);
        this.requesterId = requesterId;
        this.sendingPath = sendingPath;
    }

    public void onRecordsCollected(List<T> record) {
        byte[] recordEncoded = encodeRecords(record);
        this.messagingClient.sendNewRecord(requesterId, sendingPath, recordEncoded);
    }

    protected abstract byte[] encodeRecords(List<T> record);
}

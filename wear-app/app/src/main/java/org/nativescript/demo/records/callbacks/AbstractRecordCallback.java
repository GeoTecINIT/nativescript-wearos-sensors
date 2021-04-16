package org.nativescript.demo.records.callbacks;

import android.content.Context;

import org.nativescript.demo.records.Record;
import org.nativescript.demo.messaging.MessagingClient;

public abstract class AbstractRecordCallback<T extends Record> {

    private MessagingClient messagingClient;
    private String requesterId;
    private String sendingPath;

    public AbstractRecordCallback(Context context, String requesterId, String sendingPath) {
        this.messagingClient = new MessagingClient(context);
        this.requesterId = requesterId;
        this.sendingPath = sendingPath;
    }

    public void onRecordCollected(T record) {
        byte[] recordEncoded = encodeRecord(record);
        this.messagingClient.sendNewRecord(requesterId, sendingPath, recordEncoded);
    }

    protected abstract byte[] encodeRecord(T record);
}

package org.nativescript.demo;

import android.util.Log;

import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.Wearable;
import com.google.android.gms.wearable.WearableListenerService;

import java.nio.ByteBuffer;
import java.util.Date;

public class AcceletometerMessagingListenerService extends WearableListenerService {

    private static final String TAG = "AccelerometerMessagingListenerService";

    @Override
    public void onCreate() { super.onCreate(); }

    @Override
    public void onMessageReceived(MessageEvent event) {
        Log.d(TAG, "onMessageReceived: mensaje recibido");
        String path = event.getPath();
        if (path.equals("/accelerometer/ready")) {
            Log.d(TAG, "onMessageReceived: ready request");
            Wearable.getMessageClient(getApplicationContext())
                    .sendMessage(event.getSourceNodeId(), "/accelerometer/ready", "success".getBytes());
            return;
        }

        if (path.equals("/accelerometer/prepare")) {
            Log.d(TAG, "onMessageReceived: prepare request");
            Wearable.getMessageClient(getApplicationContext())
                    .sendMessage(event.getSourceNodeId(), "/accelerometer/prepare", "success".getBytes());
            return;
        }

        if (path.equals("/accelerometer/start")) {
            Log.d(TAG, "onMessageReceived: start request");
            byte[] array = new byte[20];
            ByteBuffer buff = ByteBuffer.wrap(array);
            buff.putFloat((float)3.1415);
            buff.putFloat((float)6.2930);
            buff.putFloat((float)1.3211);
            buff.putLong(new Date().getTime());
            Wearable.getMessageClient(getApplicationContext())
                    .sendMessage(event.getSourceNodeId(), "/accelerometer/new-record", array);
            return;
        }

        if (path.equals("/accelerometer/stop")) {
            Log.d(TAG, "onMessageReceived: stop request");
            return;
        }
    }
}

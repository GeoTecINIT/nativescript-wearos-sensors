package org.nativescript.demo.services;

import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.WearableListenerService;

import org.nativescript.demo.messaging.handlers.AccelerometerMessagingHandler;


public class SensorMessagingListenerService extends WearableListenerService {

    @Override
    public void onMessageReceived(MessageEvent event) {
        String path = event.getPath();

        if (path.contains("accelerometer")) {
            new AccelerometerMessagingHandler(this).handleMessage(event);
        }
    }
}

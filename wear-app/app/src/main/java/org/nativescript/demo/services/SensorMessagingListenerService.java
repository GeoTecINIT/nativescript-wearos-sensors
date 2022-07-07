package org.nativescript.demo.services;

import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.WearableListenerService;

import org.nativescript.demo.capabilities.CapabilityAdvertisementHandler;
import org.nativescript.demo.freemessage.FreeMessageHandler;
import org.nativescript.demo.messaging.handlers.AccelerometerMessagingHandler;
import org.nativescript.demo.messaging.handlers.GyroscopeMessagingHandler;
import org.nativescript.demo.messaging.handlers.HeartRateMessagingHandler;
import org.nativescript.demo.messaging.handlers.LocationMessagingHandler;
import org.nativescript.demo.messaging.handlers.MagnetometerMessagingHandler;


public class SensorMessagingListenerService extends WearableListenerService {

    @Override
    public void onMessageReceived(MessageEvent event) {
        String path = event.getPath();

        if (path.contains("advertise-capabilities")) {
            new CapabilityAdvertisementHandler(this).handleRequest(event);
        } else if (path.contains("accelerometer")) {
            new AccelerometerMessagingHandler(this).handleMessage(event);
        } else if (path.contains("gyroscope")) {
            new GyroscopeMessagingHandler(this).handleMessage(event);
        } else if (path.contains("magnetometer")) {
            new MagnetometerMessagingHandler(this).handleMessage(event);
        } else if(path.contains("heart-rate")) {
            new HeartRateMessagingHandler(this).handleMessage(event);
        } else if (path.contains("location")) {
            new LocationMessagingHandler(this).handleMessage(event);
        } else if (path.contains("free-message")) {
            FreeMessageHandler.getInstance().handleMessage(event);
        }
    }
}

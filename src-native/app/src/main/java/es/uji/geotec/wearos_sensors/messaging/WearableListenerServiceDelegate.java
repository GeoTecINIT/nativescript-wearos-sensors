package es.uji.geotec.wearos_sensors.messaging;

import com.google.android.gms.wearable.MessageEvent;

public interface WearableListenerServiceDelegate {
    void onMessageReceived(MessageEvent event);
}

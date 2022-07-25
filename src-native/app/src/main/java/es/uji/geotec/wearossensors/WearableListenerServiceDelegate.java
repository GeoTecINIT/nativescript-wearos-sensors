package es.uji.geotec.wearossensors;

import com.google.android.gms.wearable.MessageEvent;

public interface WearableListenerServiceDelegate {
    void onMessageReceived(MessageEvent event);
}

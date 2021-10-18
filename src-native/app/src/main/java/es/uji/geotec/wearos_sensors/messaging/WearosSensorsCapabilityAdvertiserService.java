package es.uji.geotec.wearos_sensors.messaging;

import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.WearableListenerService;

public class WearosSensorsCapabilityAdvertiserService extends WearableListenerService {

    private static MessageReceiverActivationCache activationCache;
    private static WearableListenerServiceDelegate delegate;

    @Override
    public void onCreate() { super.onCreate(); }

    @Override
    public void onMessageReceived(MessageEvent messageEvent) {
        if (messageEvent == null) {
            return;
        }

        if (delegate != null) {
            delegate.onMessageReceived(messageEvent);
        } else {
            activationCache = new MessageReceiverActivationCache(messageEvent);
        }
    }

    public static void setCapabilityAdvertiserDelegate(WearableListenerServiceDelegate serviceDelegate) {
        delegate = serviceDelegate;
        if (activationCache != null) {
            delegate.onMessageReceived(activationCache.getMessageEvent());
            activationCache = null;
        }
    }
}

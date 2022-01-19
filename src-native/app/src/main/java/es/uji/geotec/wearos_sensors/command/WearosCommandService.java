package es.uji.geotec.wearos_sensors.command;

import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.WearableListenerService;

import es.uji.geotec.wearos_sensors.messaging.MessageReceiverActivationCache;
import es.uji.geotec.wearos_sensors.messaging.WearableListenerServiceDelegate;

public class WearosCommandService extends WearableListenerService {

    private static MessageReceiverActivationCache activationCache;
    private static WearableListenerServiceDelegate delegate;

    @Override
    public void onMessageReceived(MessageEvent messageEvent) {
        if (messageEvent == null)
            return;

        if (delegate != null)
            delegate.onMessageReceived(messageEvent);
        else
            activationCache = new MessageReceiverActivationCache(messageEvent);
    }

    public static void setCommandServiceDelegate(WearableListenerServiceDelegate serviceDelegate) {
        delegate = serviceDelegate;
        if (activationCache != null) {
            delegate.onMessageReceived(activationCache.getMessageEvent());
            activationCache = null;
        }
    }
}

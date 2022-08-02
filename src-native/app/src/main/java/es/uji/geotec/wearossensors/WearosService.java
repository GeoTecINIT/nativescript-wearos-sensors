package es.uji.geotec.wearossensors;

import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.WearableListenerService;

import java.util.HashMap;

public class WearosService extends WearableListenerService {

    private static HashMap<WearService, MessageReceiverActivationCache> activationCaches = new HashMap<>();
    private static HashMap<WearService, WearableListenerServiceDelegate> delegates = new HashMap<>();

    @Override
    public void onMessageReceived(MessageEvent messageEvent) {
        if (messageEvent == null) {
            return;
        }

        String path = messageEvent.getPath();
        if (path.contains("advertise-capabilities")) {
            handleMessage(WearService.CAPABILITY, messageEvent);
        } else if (path.contains("command")) {
            handleMessage(WearService.COMMAND, messageEvent);
        } else if (path.contains("plain-message")) {
            handleMessage(WearService.PLAIN_MESSAGE, messageEvent);
        }
    }

    public static void setServiceDelegate(WearService wearService, WearableListenerServiceDelegate serviceDelegate) {
        delegates.put(wearService, serviceDelegate);
        if (activationCaches.containsKey(wearService)) {
            MessageReceiverActivationCache activationCache = activationCaches.get(wearService);
            serviceDelegate.onMessageReceived(activationCache.getMessageEvent());
            activationCaches.remove(wearService);
        }
    }

    private void handleMessage(WearService wearService, MessageEvent messageEvent) {
        if (delegates.containsKey(wearService)) {
            delegates.get(wearService).onMessageReceived(messageEvent);
        } else {
            activationCaches.put(wearService, new MessageReceiverActivationCache(messageEvent));
        }
    }
}

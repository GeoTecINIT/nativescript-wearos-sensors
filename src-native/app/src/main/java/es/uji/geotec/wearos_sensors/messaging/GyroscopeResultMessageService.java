package es.uji.geotec.wearos_sensors.messaging;

import android.util.Log;

import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.WearableListenerService;

// FIXME: I know, it is the same as for accelerometer, but making changes here gives me panic!
public class GyroscopeResultMessageService extends WearableListenerService {

    private static MessageReceiverActivationCache activationCache;
    private static WearableListenerServiceDelegate delegate;

    @Override
    public void onCreate() { super.onCreate(); }

    @Override
    public void onMessageReceived(MessageEvent messageEvent) {
        Log.d("Native gyro", "messageEvent received");
        if (messageEvent == null) {
            return;
        }

        if (delegate != null) {
            Log.d("Native gyro", "delegating to delegate");
            delegate.onMessageReceived(messageEvent);
        } else {
            Log.d("Native gyro", "caching...");
            activationCache = new MessageReceiverActivationCache(messageEvent);
        }
    }

    public static void setMessageListenerServiceDelegate(WearableListenerServiceDelegate serviceDelegate) {
        Log.d("Native gyro", "setup delegate");
        delegate = serviceDelegate;
        if (activationCache != null) {
            delegate.onMessageReceived(activationCache.getMessageEvent());
            activationCache = null;
        }
    }
}

package es.uji.geotec.wearos_sensors.messaging;

import android.util.Log;

import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.WearableListenerService;

import java.util.HashMap;

import es.uji.geotec.wearos_sensors.WearSensor;

public class WearosSensorsRecordsMessagingService extends WearableListenerService {

    private static HashMap<WearSensor, MessageReceiverActivationCache> recordActivationCache = new HashMap<>();
    private static HashMap<WearSensor, WearableListenerServiceDelegate> recordDelegates = new HashMap<>();

    @Override
    public void onCreate() { super.onCreate(); }

    @Override
    public void onMessageReceived(MessageEvent messageEvent) {
        Log.d("Native", "messageEvent received");
        if (messageEvent == null) {
            return;
        }

        String path = messageEvent.getPath();
        if (path.contains("accelerometer")) {
            handleMessage(WearSensor.ACCELEROMETER, messageEvent);
        } else if (path.contains("gyroscope")) {
            handleMessage(WearSensor.GYROSCOPE, messageEvent);
        } else if (path.contains("magnetometer")) {
            handleMessage(WearSensor.MAGNETOMETER, messageEvent);
        } else if (path.contains("location")) {
            handleMessage(WearSensor.LOCATION, messageEvent);
        } else if (path.contains("heart-rate")) {
            handleMessage(WearSensor.HEART_RATE, messageEvent);
        }
    }

    public static void setRecordServiceDelegate(WearSensor wearSensor, WearableListenerServiceDelegate serviceDelegate) {
        Log.d("Native", "record delegate setup for " + wearSensor);
        recordDelegates.put(wearSensor, serviceDelegate);
        if (recordActivationCache.containsKey(wearSensor)) {
            MessageReceiverActivationCache activationCache = recordActivationCache.get(wearSensor);
            serviceDelegate.onMessageReceived(activationCache.getMessageEvent());
            recordActivationCache.remove(wearSensor);
        }
    }

    private void handleMessage(WearSensor wearSensor, MessageEvent messageEvent) {
        if (recordDelegates.containsKey(wearSensor)) {
            recordDelegates.get(wearSensor).onMessageReceived(messageEvent);
        } else {
            recordActivationCache.put(wearSensor, new MessageReceiverActivationCache(messageEvent));
        }
    }
}

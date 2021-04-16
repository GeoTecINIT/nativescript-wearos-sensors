package org.nativescript.demo.sensoring;

import android.content.Context;
import android.hardware.SensorEventListener;

import org.nativescript.demo.listeners_notifiers.SensorListenerAndNotifier;
import org.nativescript.demo.listeners_notifiers.SensorListenerAndNotifierProvider;
import org.nativescript.demo.records.callbacks.RecordCallbackProvider;

public class CollectorManager {

    private Context context;
    private WearSensorManager wearSensorManager;

    public CollectorManager(Context context) {
        this.context = context;
        this.wearSensorManager = new WearSensorManager(context);
    }

    public boolean startCollectingFrom(WearSensor wearSensor, String requesterId, String sendingPath) {
        SensorListenerAndNotifier listener = SensorListenerAndNotifierProvider.getListenerAndNotifierFor(wearSensor);
        if (listener == null)
            return false;

        listener.setNewRecordCallback(
                RecordCallbackProvider.getRecordCallbackFor(
                        wearSensor,
                        context,
                        requesterId,
                        sendingPath
                )
        );

        return wearSensorManager.startCollectingFrom(wearSensor, listener);
    }

    public void stopCollectingFrom(WearSensor wearSensor) {
        SensorEventListener listener = SensorListenerAndNotifierProvider.getListenerAndNotifierFor(wearSensor);
        wearSensorManager.stopCollectingFrom(wearSensor, listener);
    }
}

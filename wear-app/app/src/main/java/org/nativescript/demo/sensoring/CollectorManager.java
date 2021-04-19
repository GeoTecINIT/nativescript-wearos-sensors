package org.nativescript.demo.sensoring;

import android.content.Context;
import android.hardware.SensorEventListener;

import org.nativescript.demo.listeners.WearSensorListener;
import org.nativescript.demo.listeners.SensorListenerProvider;
import org.nativescript.demo.records.accumulator.RecordAccumulator;
import org.nativescript.demo.records.accumulator.RecordAccumulatorProvider;
import org.nativescript.demo.records.callbacks.AbstractRecordCallback;
import org.nativescript.demo.records.callbacks.RecordCallbackProvider;

public class CollectorManager {

    private Context context;
    private WearSensorManager wearSensorManager;

    public CollectorManager(Context context) {
        this.context = context;
        this.wearSensorManager = new WearSensorManager(context);
    }

    public boolean startCollectingFrom(WearSensor wearSensor, String requesterId, String sendingPath) {
        WearSensorListener listener = SensorListenerProvider.getListenerAndNotifierFor(wearSensor);
        if (listener == null)
            return false;

        AbstractRecordCallback callback = RecordCallbackProvider.getRecordCallbackFor(
                wearSensor,
                context,
                requesterId,
                sendingPath
        );

        RecordAccumulator accumulator = RecordAccumulatorProvider.getRecordAccumulatorProviderFor(
                wearSensor,
                callback,
                50);

        listener.setRecordAccumulator(accumulator);

        return wearSensorManager.startCollectingFrom(wearSensor, listener);
    }

    public void stopCollectingFrom(WearSensor wearSensor) {
        SensorEventListener listener = SensorListenerProvider.getListenerAndNotifierFor(wearSensor);
        wearSensorManager.stopCollectingFrom(wearSensor, listener);
    }
}

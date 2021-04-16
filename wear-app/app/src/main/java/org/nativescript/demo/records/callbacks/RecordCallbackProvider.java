package org.nativescript.demo.records.callbacks;

import android.content.Context;

import org.nativescript.demo.sensoring.WearSensor;

public class RecordCallbackProvider {
    private RecordCallbackProvider() {
    }

    public static AbstractRecordCallback getRecordCallbackFor(
            WearSensor wearSensor,
            Context context,
            String requesterId,
            String sendingPath
    ) {
        switch (wearSensor) {
            case ACCELEROMETER:
                return new AccelerometerRecordCallback(context, requesterId, sendingPath);
            default:
                return null;
        }
    }
}

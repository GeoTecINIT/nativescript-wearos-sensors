package org.nativescript.demo.listeners_notifiers;

import android.hardware.SensorEventListener;

import org.nativescript.demo.records.callbacks.AbstractRecordCallback;

public interface SensorListenerAndNotifier extends SensorEventListener {
    void setNewRecordCallback(AbstractRecordCallback callback);
}

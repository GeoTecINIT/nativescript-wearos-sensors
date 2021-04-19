package org.nativescript.demo.messaging.handlers;

import android.Manifest;
import android.content.Context;

import org.nativescript.demo.messaging.MessagingProtocol;
import org.nativescript.demo.messaging.ResultMessagingProtocol;
import org.nativescript.demo.sensoring.WearSensor;

import java.util.ArrayList;
import java.util.Arrays;

public class AccelerometerMessagingHandler extends AbstractMessagingHandler {

    public AccelerometerMessagingHandler(Context context) {
        super(context);
    }

    @Override
    protected ArrayList<String> getRequiredPermissions() {
        return new ArrayList<>(Arrays.asList(Manifest.permission.BODY_SENSORS));
    }

    @Override
    protected MessagingProtocol getProtocol() {
        return new MessagingProtocol(
                "/accelerometer/start",
                "/accelerometer/stop",
                "/accelerometer/new-record",
                new ResultMessagingProtocol("/accelerometer/ready"),
                new ResultMessagingProtocol("/accelerometer/prepare")
        );
    }

    @Override
    protected WearSensor getWearSensorType() {
        return WearSensor.ACCELEROMETER;
    }
}

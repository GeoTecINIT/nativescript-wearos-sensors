package org.nativescript.demo.messaging.handlers;

import android.Manifest;
import android.content.Context;

import org.nativescript.demo.messaging.MessagingProtocol;
import org.nativescript.demo.messaging.ResultMessagingProtocol;
import org.nativescript.demo.sensoring.WearSensor;

import java.util.ArrayList;
import java.util.Arrays;

public class HeartRateMessagingHandler extends AbstractMessagingHandler {

    public HeartRateMessagingHandler(Context context) {
        super(context);
    }

    @Override
    protected ArrayList<String> getRequiredPermissions() {
        return new ArrayList<>(Arrays.asList(Manifest.permission.BODY_SENSORS));
    }

    @Override
    protected MessagingProtocol getProtocol() {
        return new MessagingProtocol(
                "/heart-rate/start",
                "/heart-rate/stop",
                "/heart-rate/new-record",
                new ResultMessagingProtocol("/heart-rate/ready"),
                new ResultMessagingProtocol("/heart-rate/prepare")
        );
    }

    @Override
    protected WearSensor getWearSensorType() {
        return WearSensor.HEART_RATE;
    }
}

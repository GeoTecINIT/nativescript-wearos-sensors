package org.nativescript.demo.messaging.handlers;

import android.content.Context;

import org.nativescript.demo.messaging.MessagingProtocol;
import org.nativescript.demo.messaging.ResultMessagingProtocol;
import org.nativescript.demo.sensoring.WearSensor;

import java.util.ArrayList;

public class GyroscopeMessagingHandler extends AbstractMessagingHandler {

    public GyroscopeMessagingHandler(Context context) { super(context); };

    @Override
    protected ArrayList<String> getRequiredPermissions() {
        return new ArrayList<>();
    }

    @Override
    protected MessagingProtocol getProtocol() {
        return new MessagingProtocol(
                "/gyroscope/start",
                "/gyroscope/stop",
                "/gyroscope/new-record",
                new ResultMessagingProtocol("/gyroscope/ready"),
                new ResultMessagingProtocol("/gyroscope/prepare")
        );
    }

    @Override
    protected WearSensor getWearSensorType() {
        return WearSensor.GYROSCOPE;
    }
}

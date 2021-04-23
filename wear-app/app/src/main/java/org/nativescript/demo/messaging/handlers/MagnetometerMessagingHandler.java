package org.nativescript.demo.messaging.handlers;

import android.content.Context;

import org.nativescript.demo.messaging.MessagingProtocol;
import org.nativescript.demo.messaging.ResultMessagingProtocol;
import org.nativescript.demo.sensoring.WearSensor;

import java.util.ArrayList;

public class MagnetometerMessagingHandler extends AbstractMessagingHandler {

    public MagnetometerMessagingHandler(Context context) {
        super(context);
    }

    @Override
    protected ArrayList<String> getRequiredPermissions() {
        return new ArrayList<>();
    }

    @Override
    protected MessagingProtocol getProtocol() {
        return new MessagingProtocol(
                "/magnetometer/start",
                "/magnetometer/stop",
                "/magnetometer/new-record",
                new ResultMessagingProtocol("/magnetometer/ready"),
                new ResultMessagingProtocol("/magnetometer/prepare")
        );
    }

    @Override
    protected WearSensor getWearSensorType() {
        return WearSensor.MAGNETOMETER;
    }
}

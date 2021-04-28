package org.nativescript.demo.messaging.handlers;

import android.Manifest;
import android.content.Context;

import org.nativescript.demo.messaging.MessagingProtocol;
import org.nativescript.demo.messaging.ResultMessagingProtocol;
import org.nativescript.demo.sensoring.WearSensor;

import java.util.ArrayList;
import java.util.Arrays;

public class LocationMessagingHandler extends AbstractMessagingHandler{

    public LocationMessagingHandler(Context context) {
        super(context);
    }

    @Override
    protected ArrayList<String> getRequiredPermissions() {
        return new ArrayList<>(Arrays.asList(Manifest.permission.ACCESS_FINE_LOCATION));
    }

    @Override
    protected MessagingProtocol getProtocol() {
        return new MessagingProtocol(
                "/location/start",
                "/location/stop",
                "/location/new-record",
                new ResultMessagingProtocol("/location/ready"),
                new ResultMessagingProtocol("/location/prepare")
        );
    }

    @Override
    protected WearSensor getWearSensorType() {
        return WearSensor.LOCATION;
    }
}

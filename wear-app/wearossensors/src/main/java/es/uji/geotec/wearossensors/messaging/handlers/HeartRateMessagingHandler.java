package es.uji.geotec.wearossensors.messaging.handlers;

import android.Manifest;
import android.content.Context;

import java.util.ArrayList;
import java.util.Arrays;

import es.uji.geotec.wearossensors.messaging.MessagingProtocol;
import es.uji.geotec.wearossensors.messaging.ResultMessagingProtocol;
import es.uji.geotec.wearossensors.sensoring.WearSensor;

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

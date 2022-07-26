package es.uji.geotec.wearossensors.capabilities;

import android.content.Context;

import com.google.android.gms.wearable.MessageClient;
import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.Wearable;

import java.util.List;

import es.uji.geotec.backgroundsensors.sensor.Sensor;
import es.uji.geotec.wearossensors.collection.WearCollectorManager;

public class CapabilityAdvertisementHandler {

    private MessageClient messageClient;
    private WearCollectorManager collectorManager;

    public CapabilityAdvertisementHandler(Context context) {
        this.messageClient = Wearable.getMessageClient(context);
        this.collectorManager = new WearCollectorManager(context);
    }

    public void handleRequest(MessageEvent event) {
        List<Sensor> availableSensors = this.collectorManager.availableSensors();

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < availableSensors.size(); i++) {
            sb.append(availableSensors.get(i).toString());

            if (i != availableSensors.size() - 1)
                sb.append("#");
        }

        this.messageClient.sendMessage(event.getSourceNodeId(), event.getPath(), sb.toString().getBytes());
    }
}

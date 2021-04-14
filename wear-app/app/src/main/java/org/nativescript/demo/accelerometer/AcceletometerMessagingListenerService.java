package org.nativescript.demo.accelerometer;

import android.Manifest;
import android.util.Log;

import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.Wearable;
import com.google.android.gms.wearable.WearableListenerService;

import org.nativescript.demo.messaging.MessagingClient;
import org.nativescript.demo.NotificationProvider;
import org.nativescript.demo.permissions.PermissionsManager;
import org.nativescript.demo.PreferencesManager;
import org.nativescript.demo.WearSensor;
import org.nativescript.demo.messaging.MessagingProtocol;
import org.nativescript.demo.messaging.ResultMessagingProtocol;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;

public class AcceletometerMessagingListenerService extends WearableListenerService {

    private static final String TAG = "AccelerometerMessagingListenerService";

    private static final ArrayList<String> requiredPermissions = new ArrayList<>(Arrays.asList(Manifest.permission.BODY_SENSORS));

    private MessagingProtocol protocol = new MessagingProtocol(
            "/accelerometer/start",
            "/accelerometer/stop",
            "/accelerometer/new-record",
            new ResultMessagingProtocol("/accelerometer/ready"),
            new ResultMessagingProtocol("/accelerometer/prepare")
    );

    @Override
    public void onCreate() { super.onCreate(); }

    @Override
    public void onMessageReceived(MessageEvent event) {
        String path = event.getPath();
        String sourceNodeId = event.getSourceNodeId();

        MessagingClient messageClient = new MessagingClient(this);
        ResultMessagingProtocol readyProtocol = protocol.getReadyProtocol();
        if (path.equals(readyProtocol.getMessagePath())) {
            ArrayList<String> permissionsToBeRequested =
                    PermissionsManager.permissionsToBeRequested(this, requiredPermissions);

            if (permissionsToBeRequested.size() != 0) {
                PreferencesManager preferences = new PreferencesManager(this);
                preferences.setMissingPermissionsFor(WearSensor.ACCELEROMETER, permissionsToBeRequested);

                messageClient.sendFailureResponse(sourceNodeId, readyProtocol);
                return;
            }

            messageClient.sendSuccessfulResponse(sourceNodeId, readyProtocol);
            return;
        }

        ResultMessagingProtocol prepareProtocol = protocol.getPrepareProtocol();
        if (path.equals(prepareProtocol.getMessagePath())) {
            PreferencesManager preferences = new PreferencesManager(this);
            ArrayList<String> permissions = preferences.getMissingPermissionsFor(WearSensor.ACCELEROMETER);

            NotificationProvider notificationProvider = new NotificationProvider(this);
            notificationProvider.createNotificationForPermissions(
                    permissions,
                    event.getSourceNodeId(),
                    prepareProtocol
            );
            return;
        }

        if (path.equals("/accelerometer/start")) {
            Log.d(TAG, "onMessageReceived: start request");
            byte[] array = new byte[20];
            ByteBuffer buff = ByteBuffer.wrap(array);
            buff.putFloat((float)3.1415);
            buff.putFloat((float)6.2930);
            buff.putFloat((float)1.3211);
            buff.putLong(new Date().getTime());
            Wearable.getMessageClient(getApplicationContext())
                    .sendMessage(event.getSourceNodeId(), "/accelerometer/new-record", array);
            return;
        }

        if (path.equals("/accelerometer/stop")) {
            Log.d(TAG, "onMessageReceived: stop request");
            return;
        }
    }
}

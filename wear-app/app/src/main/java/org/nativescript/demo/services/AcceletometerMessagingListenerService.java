package org.nativescript.demo.services;

import android.Manifest;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;

import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.WearableListenerService;

import org.nativescript.demo.IntentManager;
import org.nativescript.demo.messaging.MessagingClient;
import org.nativescript.demo.NotificationProvider;
import org.nativescript.demo.permissions.PermissionsManager;
import org.nativescript.demo.PreferencesManager;
import org.nativescript.demo.sensoring.WearSensor;
import org.nativescript.demo.messaging.MessagingProtocol;
import org.nativescript.demo.messaging.ResultMessagingProtocol;

import java.util.ArrayList;
import java.util.Arrays;

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

    private String sourceNodeId;

    private ServiceConnection currentConnection;

    @Override
    public void onCreate() {
        super.onCreate();
        currentConnection = null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        if (currentConnection != null) {
            unbindService(currentConnection);
        }
    }

    @Override
    public void onMessageReceived(MessageEvent event) {
        String path = event.getPath();
        sourceNodeId = event.getSourceNodeId();

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

        if (path.equals(protocol.getStartMessagePath())) {
            currentConnection = getServiceConnectionForAction(ServiceAction.START_COLLECTING);
            Intent intent = IntentManager.intentForSensorRecordingService(this);
            startForegroundService(intent);
            bindService(
                    intent,
                    currentConnection,
                    Context.BIND_AUTO_CREATE);
            return;
        }

        if (path.equals(protocol.getStopMessagePath())) {
            currentConnection = getServiceConnectionForAction(ServiceAction.STOP_COLLECTING);
            Intent intent = IntentManager.intentForSensorRecordingService(this);
            startForegroundService(intent);
            bindService(
                    intent,
                    currentConnection,
                    Context.BIND_AUTO_CREATE
            );
            return;
        }
    }

    private ServiceConnection getServiceConnectionForAction(final ServiceAction action) {
        return new ServiceConnection() {

            @Override
            public void onServiceConnected(ComponentName name, IBinder service) {
                SensorRecordingService.SensorRecordingBinder binder =
                        (SensorRecordingService.SensorRecordingBinder) service;

                switch (action) {
                    case START_COLLECTING:
                        binder.startRecordingFor(
                                WearSensor.ACCELEROMETER,
                                sourceNodeId,
                                protocol.getNewRecordMessagePath()
                        );
                        break;
                    case STOP_COLLECTING:
                        binder.stopRecordingFor(WearSensor.ACCELEROMETER);
                        break;
                }
            }

            @Override
            public void onServiceDisconnected(ComponentName name) {
                return;
            }
        };
    }
}

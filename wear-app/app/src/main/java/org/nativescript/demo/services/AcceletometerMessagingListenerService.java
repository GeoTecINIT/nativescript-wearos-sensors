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
import org.nativescript.demo.sensoring.WearSensor;
import org.nativescript.demo.messaging.MessagingProtocol;
import org.nativescript.demo.messaging.ResultMessagingProtocol;
import org.nativescript.demo.sensoring.WearSensorManager;

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
        String sourceNodeId = event.getSourceNodeId();

        if (path.equals(protocol.getReadyProtocol().getMessagePath())) {
            handleIsReadyRequest(sourceNodeId);
        } else if (path.equals(protocol.getPrepareProtocol().getMessagePath())) {
            handlePrepareRequest(sourceNodeId);
        } else if (path.equals(protocol.getStartMessagePath())) {
            handleStartRequest(sourceNodeId);
        } else if (path.equals(protocol.getStopMessagePath())) {
            handleStopRequest(sourceNodeId);
        }
    }

    private void handleIsReadyRequest(String sourceNodeId) {
        MessagingClient messageClient = new MessagingClient(this);
        ResultMessagingProtocol readyProtocol = protocol.getReadyProtocol();
        ArrayList<String> permissionsToBeRequested =
                PermissionsManager.permissionsToBeRequested(this, requiredPermissions);

        if (!isSensorSupported(WearSensor.ACCELEROMETER) || permissionsToBeRequested.size() != 0) {
            messageClient.sendFailureResponse(sourceNodeId, readyProtocol);
            return;
        }

        messageClient.sendSuccessfulResponse(sourceNodeId, readyProtocol);
    }

    private void handlePrepareRequest(String sourceNodeId) {
        MessagingClient messageClient = new MessagingClient(this);
        ResultMessagingProtocol prepareProtocol = protocol.getPrepareProtocol();

        if (!isSensorSupported(WearSensor.ACCELEROMETER)) {
            messageClient.sendFailureResponseWithReason(
                    sourceNodeId,
                    prepareProtocol,
                    "Sensor of type " + WearSensor.ACCELEROMETER + " not supported");
            return;
        }

        ArrayList<String> permissionsToBeRequested =
                PermissionsManager.permissionsToBeRequested(this, requiredPermissions);

        if (permissionsToBeRequested.size() != 0) {
            NotificationProvider notificationProvider = new NotificationProvider(this);
            notificationProvider.createNotificationForPermissions(
                    permissionsToBeRequested,
                    sourceNodeId,
                    prepareProtocol
            );
            return;
        }

        messageClient.sendSuccessfulResponse(sourceNodeId, prepareProtocol);
    }

    private void handleStartRequest(String sourceNodeId) {
        currentConnection = getServiceConnectionForAction(ServiceAction.START_COLLECTING, sourceNodeId);
        Intent intent = IntentManager.intentForSensorRecordingService(this);
        startForegroundService(intent);
        bindService(
                intent,
                currentConnection,
                Context.BIND_AUTO_CREATE);
    }

    private void handleStopRequest(String sourceNodeId) {
        currentConnection = getServiceConnectionForAction(ServiceAction.STOP_COLLECTING, sourceNodeId);
        Intent intent = IntentManager.intentForSensorRecordingService(this);
        startForegroundService(intent);
        bindService(
                intent,
                currentConnection,
                Context.BIND_AUTO_CREATE
        );
    }

    private boolean isSensorSupported(WearSensor wearSensor) {
        WearSensorManager wearSensorManager = new WearSensorManager(this);
        return wearSensorManager.isSensorAvailable(wearSensor);
    }

    private ServiceConnection getServiceConnectionForAction(final ServiceAction action, final String sourceNodeId) {
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

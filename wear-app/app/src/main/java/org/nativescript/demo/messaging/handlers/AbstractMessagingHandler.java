package org.nativescript.demo.messaging.handlers;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;

import com.google.android.gms.wearable.MessageEvent;

import org.nativescript.demo.IntentManager;
import org.nativescript.demo.NotificationProvider;
import org.nativescript.demo.messaging.MessagingClient;
import org.nativescript.demo.messaging.MessagingProtocol;
import org.nativescript.demo.messaging.ResultMessagingProtocol;
import org.nativescript.demo.permissions.PermissionsManager;
import org.nativescript.demo.sensoring.SensoringConfiguration;
import org.nativescript.demo.sensoring.WearSensor;
import org.nativescript.demo.sensoring.WearSensorManager;
import org.nativescript.demo.services.SensorRecordingService;
import org.nativescript.demo.services.ServiceAction;

import java.util.ArrayList;

public abstract class AbstractMessagingHandler {

    private Context context;

    public AbstractMessagingHandler(Context context) {
        this.context = context;
    }

    public void handleMessage(MessageEvent event) {
        String path = event.getPath();
        String sourceNodeId = event.getSourceNodeId();
        MessagingProtocol protocol = getProtocol();

        if (path.equals(protocol.getReadyProtocol().getMessagePath())) {
            handleIsReadyRequest(sourceNodeId);
        } else if (path.equals(protocol.getPrepareProtocol().getMessagePath())) {
            handlePrepareRequest(sourceNodeId);
        } else if (path.equals(protocol.getStartMessagePath())) {
            handleStartRequest(sourceNodeId, event.getData());
        } else if (path.equals(protocol.getStopMessagePath())) {
            handleStopRequest(sourceNodeId);
        }
    }

    private void handleIsReadyRequest(String sourceNodeId) {
        MessagingClient messageClient = new MessagingClient(context);
        ResultMessagingProtocol readyProtocol = getProtocol().getReadyProtocol();
        ArrayList<String> permissionsToBeRequested =
                PermissionsManager.permissionsToBeRequested(context, getRequiredPermissions());

        if (!isSensorSupported() || permissionsToBeRequested.size() != 0) {
            messageClient.sendFailureResponse(sourceNodeId, readyProtocol);
            return;
        }

        messageClient.sendSuccessfulResponse(sourceNodeId, readyProtocol);
    }

    private void handlePrepareRequest(String sourceNodeId) {
        MessagingClient messageClient = new MessagingClient(context);
        ResultMessagingProtocol prepareProtocol = getProtocol().getPrepareProtocol();

        if (!isSensorSupported()) {
            messageClient.sendFailureResponseWithReason(
                    sourceNodeId,
                    prepareProtocol,
                    "Sensor of type " + getWearSensorType() + " not supported");
            return;
        }

        ArrayList<String> permissionsToBeRequested =
                PermissionsManager.permissionsToBeRequested(context, getRequiredPermissions());

        if (permissionsToBeRequested.size() != 0) {
            NotificationProvider notificationProvider = new NotificationProvider(context);
            notificationProvider.createNotificationForPermissions(
                    permissionsToBeRequested,
                    sourceNodeId,
                    prepareProtocol
            );
            return;
        }

        messageClient.sendSuccessfulResponse(sourceNodeId, prepareProtocol);
    }

    private void handleStartRequest(String sourceNodeId, byte[] configuration) {
        String[] configParams = new String(configuration).split("#");
        Intent intent = IntentManager.intentForSensorRecordingService(context);
        context.startForegroundService(intent);
        context.bindService(
                intent,
                getServiceConnectionForAction(
                        ServiceAction.START_COLLECTING,
                        sourceNodeId,
                        Integer.parseInt(configParams[0]),
                        Integer.parseInt(configParams[1])
                ),
                Context.BIND_AUTO_CREATE);
    }

    private void handleStopRequest(String sourceNodeId) {
        Intent intent = IntentManager.intentForSensorRecordingService(context);
        context.startForegroundService(intent);
        context.bindService(
                intent,
                getServiceConnectionForAction(ServiceAction.STOP_COLLECTING, sourceNodeId, -1, -1),
                Context.BIND_AUTO_CREATE
        );
    }

    private boolean isSensorSupported() {
        WearSensorManager wearSensorManager = new WearSensorManager(context);
        WearSensor wearSensor = getWearSensorType();
        return wearSensorManager.isSensorAvailable(wearSensor);
    }

    private ServiceConnection getServiceConnectionForAction(final ServiceAction action, final String sourceNodeId, final int sensorDelay, final int batchSize) {
        return new ServiceConnection() {

            @Override
            public void onServiceConnected(ComponentName name, IBinder service) {
                SensorRecordingService.SensorRecordingBinder binder =
                        (SensorRecordingService.SensorRecordingBinder) service;
                WearSensor wearSensor = getWearSensorType();
                switch (action) {
                    case START_COLLECTING:
                        SensoringConfiguration sensoringConfiguration = new SensoringConfiguration(
                                wearSensor,
                                sourceNodeId,
                                getProtocol().getNewRecordMessagePath(),
                                sensorDelay,
                                batchSize
                        );
                        binder.startRecordingFor(sensoringConfiguration);
                        break;
                    case STOP_COLLECTING:
                        binder.stopRecordingFor(wearSensor);
                        break;
                }
                context.unbindService(this);
            }

            @Override
            public void onServiceDisconnected(ComponentName name) {
                return;
            }
        };
    }

    protected abstract ArrayList<String> getRequiredPermissions();

    protected abstract MessagingProtocol getProtocol();

    protected abstract WearSensor getWearSensorType();
}

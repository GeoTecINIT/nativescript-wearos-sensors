package es.uji.geotec.wearossensors.messaging.handlers;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;

import com.google.android.gms.wearable.MessageEvent;

import java.util.ArrayList;

import es.uji.geotec.wearossensors.intent.IntentManager;
import es.uji.geotec.wearossensors.messaging.MessagingClient;
import es.uji.geotec.wearossensors.messaging.MessagingProtocol;
import es.uji.geotec.wearossensors.messaging.ResultMessagingProtocol;
import es.uji.geotec.wearossensors.notifications.NotificationProvider;
import es.uji.geotec.wearossensors.permissions.PermissionsManager;
import es.uji.geotec.wearossensors.sensoring.SensoringConfiguration;
import es.uji.geotec.wearossensors.sensoring.WearSensor;
import es.uji.geotec.wearossensors.sensoring.WearSensorManager;
import es.uji.geotec.wearossensors.services.SensorRecordingService;
import es.uji.geotec.wearossensors.services.ServiceAction;

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
                    PermissionsManager.getPermissionsActivity(context),
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
        context.bindService(
                intent,
                getServiceConnectionForAction(
                        ServiceAction.START_COLLECTING,
                        sourceNodeId,
                        Integer.parseInt(configParams[0]),
                        Integer.parseInt(configParams[1])
                ),
                0);
        context.startForegroundService(intent);
    }

    private void handleStopRequest(String sourceNodeId) {
        Intent intent = IntentManager.intentForSensorRecordingService(context);
        context.bindService(
                intent,
                getServiceConnectionForAction(ServiceAction.STOP_COLLECTING, sourceNodeId, -1, -1),
                0
        );
        //context.startForegroundService(intent);
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

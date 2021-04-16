package org.nativescript.demo;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;

import org.nativescript.demo.services.SensorRecordingService;
import org.nativescript.demo.permissions.RequestPermissionsActivity;
import org.nativescript.demo.messaging.ResultMessagingProtocol;

import java.util.ArrayList;

public class IntentManager {

    private static final int PENDING_INTENT_RC = 50;

    private static final String PERMISSIONS_EXTRAS = "PERMISSIONS";
    private static final String NODE = "NODE";
    private static final String PROTOCOL = "PROTOCOL";

    private IntentManager() {
    }

    public static Intent intentForSensorRecordingService(Context context) {
        return new Intent(context, SensorRecordingService.class);
    }

    public static PendingIntent pendingIntentFromPermissionsToRequest(
            Context context,
            ArrayList<String> permissions,
            String sourceNodeId,
            ResultMessagingProtocol resultProtocol
    ) {
        Intent permissionRequester = new Intent(context, RequestPermissionsActivity.class);

        permissionRequester.putStringArrayListExtra(PERMISSIONS_EXTRAS, permissions);
        permissionRequester.putExtra(NODE, sourceNodeId);
        permissionRequester.putExtra(PROTOCOL, resultProtocol);

        return PendingIntent.getActivity(
                context,
                PENDING_INTENT_RC,
                permissionRequester,
                0
        );
    }

    public static ArrayList<String> permissionsToRequestFromIntent(Intent intent) {
        return intent.getStringArrayListExtra(PERMISSIONS_EXTRAS);
    }

    public static String sourceNodeIdFromIntent(Intent intent) {
        return intent.getStringExtra(NODE);
    }

    public static ResultMessagingProtocol resultProtocolFromIntent(Intent intent) {
        return (ResultMessagingProtocol) intent.getSerializableExtra(PROTOCOL);
    }
}

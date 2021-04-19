package org.nativescript.demo.permissions;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.wearable.activity.WearableActivity;
import android.util.Log;

import androidx.annotation.NonNull;

import org.nativescript.demo.IntentManager;
import org.nativescript.demo.messaging.MessagingClient;
import org.nativescript.demo.R;
import org.nativescript.demo.messaging.ResultMessagingProtocol;

import java.util.ArrayList;
import java.util.Timer;
import java.util.TimerTask;

public class RequestPermissionsActivity extends WearableActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.d("OUCH", "OUCHHH");
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_permissions);

        // Enables Always-on
        setAmbientEnabled();

        Timer delayer = new Timer();
        delayer.schedule(new TimerTask() {
            @Override
            public void run() {
                ArrayList<String> permissionsToRequest = IntentManager.permissionsToRequestFromIntent(getIntent());
                requestPermissions(permissionsToRequest);
            }
        }, 100);
    }


    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode != PermissionsManager.PERMISSIONS_RC) {
            return;
        }

        ArrayList<String> permissionsRejected = new ArrayList<>();
        for (int i = 0; i < grantResults.length; i++) {
            if (grantResults[i] == PackageManager.PERMISSION_DENIED) {
                permissionsRejected.add(permissions[i]);
            }
        }

        MessagingClient messagingClient = new MessagingClient(this);
        String sourceNodeId = IntentManager.sourceNodeIdFromIntent(getIntent());
        ResultMessagingProtocol protocol = IntentManager.resultProtocolFromIntent(getIntent());
        if (permissionsRejected.size() == 0) {
            messagingClient.sendSuccessfulResponse(sourceNodeId, protocol);
            finish();
            return;
        }

        String failureMessage = buildFailureMessage(permissionsRejected);
        messagingClient.sendFailureResponseWithReason(sourceNodeId, protocol, failureMessage);
        finish();
    }

    private void requestPermissions(ArrayList<String> permissions) {
        PermissionsManager.requestPermissions(this, permissions);
    }

    private String buildFailureMessage(ArrayList<String> failures) {
        StringBuilder sb = new StringBuilder();
        sb.append("Permissions rejected: ");
        String separator = " ";
        for (String failure : failures) {
            sb.append(separator);
            separator = ", ";
            sb.append(failure);
        }

        return sb.toString();
    }
}

package org.nativescript.demo.permissions;

import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.FragmentActivity;

import org.nativescript.demo.IntentManager;
import org.nativescript.demo.messaging.MessagingClient;
import org.nativescript.demo.R;
import org.nativescript.demo.messaging.ResultMessagingProtocol;

import java.util.ArrayList;
import java.util.Timer;
import java.util.TimerTask;

public class RequestPermissionsActivity extends FragmentActivity {

    TextView descriptionText;
    ProgressBar progressBar;
    ImageView checkIcon, failIcon;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_permissions);

        descriptionText = findViewById(R.id.description);
        progressBar = findViewById(R.id.progressBar);
        checkIcon = findViewById(R.id.checkIcon);
        failIcon = findViewById(R.id.failIcon);

        Timer delayer = new Timer();
        delayer.schedule(new TimerTask() {
            @Override
            public void run() {
                ArrayList<String> permissionsToRequest = IntentManager.permissionsToRequestFromIntent(getIntent());
                requestPermissions(permissionsToRequest);
            }
        }, 500);
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

        progressBar.setVisibility(View.GONE);

        MessagingClient messagingClient = new MessagingClient(this);
        String sourceNodeId = IntentManager.sourceNodeIdFromIntent(getIntent());
        ResultMessagingProtocol protocol = IntentManager.resultProtocolFromIntent(getIntent());
        if (permissionsRejected.size() == 0) {
            messagingClient.sendSuccessfulResponse(sourceNodeId, protocol);
            descriptionText.setText("Gracias :D");
            checkIcon.setVisibility(View.VISIBLE);
            //finish();
            return;
        }

        String failureMessage = buildFailureMessage(permissionsRejected);
        messagingClient.sendFailureResponseWithReason(sourceNodeId, protocol, failureMessage);
        descriptionText.setText("Permisos denegados :(");
        failIcon.setVisibility(View.VISIBLE);
        //finish();
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

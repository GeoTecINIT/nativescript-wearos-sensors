package org.nativescript.demo;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.os.Build;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import org.nativescript.demo.messaging.ResultMessagingProtocol;

import java.util.ArrayList;

public class NotificationProvider {

    private static final String REQUEST_PERMISSIONS_CHANNEL = "REQUEST_PERMISSIONS_CHANNEL";
    private static final String REQUEST_PERMISSIONS_DESCRIPTION = "Solucitud de permisos";

    private Context context;
    private NotificationManagerCompat notificationManager;

    public NotificationProvider(Context context) {
        this.context = context;
        this.notificationManager = NotificationManagerCompat.from(context);
    }

    public void createNotificationForPermissions(
            ArrayList<String> permissions,
            String sourceNodeId,
            ResultMessagingProtocol resultProtocol
    ) {
        setupNotificationChannelIfNeeded(
                REQUEST_PERMISSIONS_CHANNEL,
                REQUEST_PERMISSIONS_DESCRIPTION
        );

        PendingIntent pendingIntent = IntentManager.pendingIntentFromPermissionsToRequest(
                context,
                permissions,
                sourceNodeId,
                resultProtocol
        );

        NotificationCompat.Builder notificationBuilder =
                new NotificationCompat.Builder(context, REQUEST_PERMISSIONS_CHANNEL)
                .setContentTitle("Permisos necesarios")
                .setContentText("Necesitamos permisos para poder obtener datos y venderlos en la deep web")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(pendingIntent)
                .setPriority(NotificationCompat.PRIORITY_MAX);

        notificationManager.notify(23, notificationBuilder.build());
    }

    private void setupNotificationChannelIfNeeded(String id, String name) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (notificationManager.getNotificationChannel(id) != null) {
                return;
            }

            NotificationChannel channel = new NotificationChannel(
                    id,
                    name,
                    NotificationManager.IMPORTANCE_LOW
            );

            notificationManager.createNotificationChannel(channel);
        }
    }
}

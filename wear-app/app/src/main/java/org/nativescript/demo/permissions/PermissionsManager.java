package org.nativescript.demo.permissions;

import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;

import androidx.core.app.ActivityCompat;

import java.util.ArrayList;

public class PermissionsManager {

    public static final int PERMISSIONS_RC = 51;

    private PermissionsManager() {
    }

    public static ArrayList<String> permissionsToBeRequested(Context context, ArrayList<String> required) {
        ArrayList<String> toBeRequested = new ArrayList<>(required.size());
        for (String permission : required) {
            int granted = ActivityCompat.checkSelfPermission(context, permission);
            if (granted == PackageManager.PERMISSION_DENIED) {
                toBeRequested.add(permission);
            }
        }

        return toBeRequested;
    }

    public static void requestPermissions(Activity activity, ArrayList<String> permissions) {
        String[] permissionsArray = new String[permissions.size()];
        permissions.toArray(permissionsArray);
        activity.requestPermissions(permissionsArray, PERMISSIONS_RC);
    }
}

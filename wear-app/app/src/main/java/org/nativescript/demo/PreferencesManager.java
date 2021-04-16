package org.nativescript.demo;

import android.content.Context;
import android.content.SharedPreferences;

import org.nativescript.demo.sensoring.WearSensor;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class PreferencesManager {

    private static String PREFERENCES_NAME = "WEAR_APP_PREFERENCES";

    private SharedPreferences preferences;

    public PreferencesManager(Context context) {
        this.preferences = context.getSharedPreferences(PREFERENCES_NAME, Context.MODE_PRIVATE);
    }

    public void setMissingPermissionsFor(WearSensor wearSensor, ArrayList<String> permissions) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putStringSet(wearSensor.toString(), new HashSet<>(permissions));
        editor.apply();
    }

    public ArrayList<String> getMissingPermissionsFor(WearSensor wearSensor) {
        Set<String> permissionsSet = preferences.getStringSet(wearSensor.toString(), null);
        return new ArrayList<>(permissionsSet);
    }

    public void clearMissingPermissionsFor(WearSensor wearSensor) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.remove(wearSensor.toString());
        editor.apply();
    }
}

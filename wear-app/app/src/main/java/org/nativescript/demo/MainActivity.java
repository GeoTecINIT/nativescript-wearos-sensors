package org.nativescript.demo;

import android.os.Bundle;
import android.support.wearable.activity.WearableActivity;
import android.view.View;

import org.nativescript.demo.command.CommandClient;

public class MainActivity extends WearableActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Enables Always-on
        setAmbientEnabled();
    }

    public void onStartButtonClick(View view) {
        CommandClient commandClient = new CommandClient(this);
        commandClient.sendCommand("request-start");
    }
}
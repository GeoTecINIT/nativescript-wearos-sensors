package org.nativescript.demo;

import android.app.Activity;
import android.content.res.Resources;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.LinearLayout;
import android.widget.Spinner;

import org.nativescript.demo.command.CommandClient;
import org.nativescript.demo.sensoring.WearSensor;

public class MainActivity extends Activity {

    private LinearLayout linearLayout;
    private Spinner sensorSpinner;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        setupLayout();
        setupSpinner();
    }

    public void onCommandButtonClick(View view) {
        CommandClient commandClient = new CommandClient(this);
        commandClient.sendCommand("start-all");
    }

    public void onSingleCommandButtonClick(View view) {
        String selectedSensor = (String) sensorSpinner.getSelectedItem();
        CommandClient commandClient = new CommandClient(this);
        commandClient.sendCommand("start-" + selectedSensor.toLowerCase());
    }

    private void setupLayout() {
        linearLayout = findViewById(R.id.linear_layout);
        if (this.getResources().getConfiguration().isScreenRound()) {
            int padding = (int) (Resources.getSystem().getDisplayMetrics().widthPixels * 0.146467f);
            linearLayout.setPadding(padding, padding, padding, padding);
        }
    }

    private void setupSpinner() {
        sensorSpinner = findViewById(R.id.sensor_spinner);

        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        for (WearSensor sensor : WearSensor.values()) {
            adapter.add(sensor.toString());
        }

        sensorSpinner.setAdapter(adapter);
    }
}
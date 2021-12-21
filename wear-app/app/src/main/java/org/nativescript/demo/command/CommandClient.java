package org.nativescript.demo.command;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.wearable.CapabilityClient;
import com.google.android.gms.wearable.CapabilityInfo;
import com.google.android.gms.wearable.MessageClient;
import com.google.android.gms.wearable.Node;
import com.google.android.gms.wearable.Wearable;

import java.util.Set;

public class CommandClient {

    private CapabilityClient capabilityClient;
    private MessageClient messageClient;

    public CommandClient(Context context) {
        this.capabilityClient = Wearable.getCapabilityClient(context);
        this.messageClient = Wearable.getMessageClient(context);
    }

    public void sendCommand(final String command) {
        capabilityClient.getCapability("main-node", CapabilityClient.FILTER_ALL)
                .addOnSuccessListener(new OnSuccessListener<CapabilityInfo>() {
                    @Override
                    public void onSuccess(CapabilityInfo capabilityInfo) {
                        Set<Node> mainNodes = capabilityInfo.getNodes();
                        if (mainNodes.isEmpty())
                            return;

                        Node mainNode = mainNodes.iterator().next();
                        messageClient.sendMessage(mainNode.getId(), "command", command.getBytes());
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        Log.d("Failure", e.getMessage());
                    }
                });
    }
}

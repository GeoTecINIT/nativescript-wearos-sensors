package org.nativescript.demo.freemessage;

import android.content.Context;
import android.util.Log;

import com.google.android.gms.wearable.MessageEvent;

public class FreeMessageHandler {

    private Context context;
    private FreeMessageProtocol protocol;

    public FreeMessageHandler(Context context) {
        this.context = context;
        this.protocol = FreeMessageProtocol.getProtocol();
    }

    public void handleMessage(MessageEvent event) {
        String path = event.getPath();

        if (!path.equals(this.protocol.getExpectingResponsePath())
                && !path.equals(this.protocol.getWithoutResponsePath())) {
            return;
        }

        if (event.getData() == null) {
            return;
        }

        String sourceNodeId = event.getSourceNodeId();
        String encodedMessage = new String(event.getData());

        FreeMessage message = FreeMessage.decodeFreeMessage(encodedMessage);
        ReceivedMessage receivedMessage = new ReceivedMessage(
            sourceNodeId,
            message,
            path.equals(this.protocol.getExpectingResponsePath())
        );
        Log.d("FreeMessageHandler", receivedMessage.toString());

        // TODO: Listener callback
    }
}

package es.uji.geotec.wearossensors;

import com.google.android.gms.wearable.MessageEvent;

public class MessageReceiverActivationCache {
    private final MessageEvent messageEvent;

    public MessageReceiverActivationCache(MessageEvent messageEvent) {
        this.messageEvent = messageEvent;
    }

    public MessageEvent getMessageEvent() { return messageEvent; }
}

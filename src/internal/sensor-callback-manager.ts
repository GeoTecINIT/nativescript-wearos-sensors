import {
    Observable,
    EventData as NSEventData,
} from "@nativescript/core";
import { fromObject } from "@nativescript/core/data/observable";
import { SensorRecord } from "./sensors/sensor-record";

interface InternalEventData extends NSEventData {
    data: SensorRecord<any>;
}
type InternalEventCallback = (eventData: InternalEventData) => void;
interface CallbackDescriptor {
    eventName: string;
    callback: InternalEventCallback;
}
export type SensorCallback = (sensorRecord: SensorRecord<any>) => void;

export class SensorCallbackManager {

    private notificationCenter: Observable;
    private listenerCounter: number;
    private callbacks: Map<number, CallbackDescriptor>;

    constructor() {
        this.notificationCenter = fromObject({});
        this.listenerCounter = 0;
        this.callbacks = new Map<number, CallbackDescriptor>();
    }

    add(callback: SensorCallback, eventName: string): number {
        const callbackId = this.listenerCounter;
        const internalCallback = (eventData: InternalEventData) => callback(eventData.data);
        this.callbacks.set(callbackId, {
            eventName: eventName,
            callback: internalCallback
        });
        this.notificationCenter.on(eventName, internalCallback);
        return this.listenerCounter++;
    }

    notifyAll(record: SensorRecord<any>): void {
        if (!this.notificationCenter.hasListeners(record.type)) {
            return;
        }
        const eventData: InternalEventData = {
            eventName: record.type,
            object: this.notificationCenter,
            data: record,
        };
        this.notificationCenter.notify<InternalEventData>(eventData);
    }

    remove(callbackId: number): void {
        if (!this.callbacks.has(callbackId)) {
            return;
        }
        const callbackDescriptor = this.callbacks.get(callbackId);
        this.notificationCenter.off(callbackDescriptor.eventName, callbackDescriptor.callback);
        this.callbacks.delete(callbackId);
    }

    removeAllForEvent(eventName: string) {
        this.notificationCenter.off(eventName);
        this.callbacks.forEach((value, key) => {
            if (value.eventName === eventName)
                this.callbacks.delete(key);
        });
    }

    removeAll() {
        this.notificationCenter = fromObject({});
        this.callbacks.clear();
    }
}

let _callbackManager;
export function getSensorCallbackManager() {
    if (!_callbackManager) {
        _callbackManager = new SensorCallbackManager();
    }
    return _callbackManager;
}

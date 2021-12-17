import {
    Observable,
    EventData as NSEventData,
} from "@nativescript/core";
import { fromObject } from "@nativescript/core/data/observable";
import { SensorRecords } from "./sensors/sensor-record";

interface InternalEventData extends NSEventData {
    data: SensorRecords<any>;
}
type InternalEventCallback = (eventData: InternalEventData) => void;
interface CallbackDescriptor {
    eventName: string;
    callback: InternalEventCallback;
}
export type SensorCallback = (sensorRecords: SensorRecords<any>) => void;

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

    notifyAll(records: SensorRecords<any>): void {
        if (!this.notificationCenter.hasListeners(records.type)) {
            return;
        }
        const eventData: InternalEventData = {
            eventName: records.type,
            object: this.notificationCenter,
            data: records,
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

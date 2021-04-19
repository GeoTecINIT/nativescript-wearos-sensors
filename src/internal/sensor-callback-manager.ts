import {
    Observable,
    fromObject,
    EventData as NSEventData,
} from "tns-core-modules/data/observable";
import {SensorRecord} from "./sensor-record";

interface InternalEventData extends NSEventData {
    data: SensorRecord[];
}
type InternalEventCallback = (eventData: InternalEventData) => void;
export type SensorCallback = <T extends SensorRecord[]>(sensorRecords) => void;

export class SensorCallbackManager<T extends SensorRecord[]> {

    private notificationCenter: Observable;
    private listenerCounter: number;
    private callbacks: Map<number, SensorCallback>;

    constructor(private eventName: string) {
        this.notificationCenter = fromObject({});
        this.listenerCounter = 0;
        this.callbacks = new Map<number, InternalEventCallback>();
    }

    add(callback: SensorCallback): number {
        const callbackId = this.listenerCounter;
        const internalCallback = (eventData: InternalEventData) => callback(eventData.data);
        this.callbacks.set(callbackId, internalCallback);
        this.notificationCenter.on(this.eventName, internalCallback);
        return this.listenerCounter++;
    }

    notifyAll(records: T): void {
        if (!this.notificationCenter.hasListeners(this.eventName)) {
            return;
        }
        const eventData: InternalEventData = {
            eventName: this.eventName,
            object: this.notificationCenter,
            data: records,
        };
        this.notificationCenter.notify<InternalEventData>(eventData);
    }

    remove(callbackId: number): void {
        if (!this.callbacks.has(callbackId)) {
            return;
        }
        const callback = this.callbacks.get(callbackId);
        this.notificationCenter.off(this.eventName, callback);
        this.callbacks.delete(callbackId);
    }

    removeAll() {
        this.notificationCenter.off(this.eventName);
        this.callbacks.clear();
    }
}

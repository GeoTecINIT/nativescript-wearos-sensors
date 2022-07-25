import { SensorRecord } from "./sensors/sensor-record";
import { Node } from "./node";
import { SensorType } from "./sensors/sensor-type";

export interface ListenerFilter {
    nodes?: Node[];
    sensors?: SensorType[];
}

interface ListenerDescriptor {
    listener: SensorListener;
    filters?: ListenerFilter;
}

export type SensorListener = (sensorRecord: SensorRecord<any>) => void;

export class SensorListenerManager {

    private listenerCounter: number;
    private listeners: Map<number, ListenerDescriptor>;

    constructor() {
        this.listenerCounter = 0;
        this.listeners = new Map<number, ListenerDescriptor>();
    }

    add(listener: SensorListener, filters?: ListenerFilter): number {
        const listenerId = this.listenerCounter;
        this.listeners.set(listenerId, { listener, filters });
        return this.listenerCounter++;
    }

    notify(record: SensorRecord<any>): void {
        this.listeners.forEach((listenerDescriptor) => {
            const { listener, filters } = listenerDescriptor;

            if (!filters
                || (isListeningForType(record.type, filters)
                    && isListeningForNode(record.deviceId, filters))
            ) {
                listener(record);
            }
        });
    }

    remove(callbackId: number): void {
        if (!this.listeners.has(callbackId)) {
            return;
        }
        this.listeners.delete(callbackId);
    }

    removeAll() {
        this.listeners.clear();
    }
}

function isListeningForType(sensorType: SensorType, listenerFilters: ListenerFilter): boolean {
    return listenerFilters.sensors ? listenerFilters.sensors.indexOf(sensorType) !== -1 : true;
}

function isListeningForNode(nodeId: string, listenerFilters: ListenerFilter): boolean {
    return listenerFilters.nodes ? listenerFilters.nodes.filter((node) => node.id === nodeId).length > 0 : true;
}


let _listenerManager;
export function getSensorListenerManager() {
    if (!_listenerManager) {
        _listenerManager = new SensorListenerManager();
    }
    return _listenerManager;
}

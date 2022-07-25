import { SensorRecord } from "nativescript-wearos-sensors/internal/sensors/sensor-record";
import { knownFolders } from "@nativescript/core";

export class Store {

    private records: SensorRecord<any>[] = [];

    public addRecord(record: SensorRecord<any>): void {
        this.records.push(record);
    }

    public store(fileName: string, clearAfter: boolean = false): Promise<any> {
        if (this.records.length === 0) {
            throw new Error("Nothing to store!");
        }

        const folder = knownFolders.documents();
        const file = folder.getFile(fileName);

        const recordsToStore = this.records.slice();

        if (clearAfter) this.clear();

        return file.writeText(JSON.stringify(recordsToStore));
    }

    public clear() {
        this.records = [];
    }
}

let _instance;
export function getStore(): Store {
    if (!_instance)
        _instance = new Store();
    return _instance;
}

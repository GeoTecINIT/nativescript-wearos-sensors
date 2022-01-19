import { SensorRecords } from "../sensors/sensor-record";
import { knownFolders } from "@nativescript/core";

export class Store {

    private records: SensorRecords<any>[] = [];

    public addRecord(record: SensorRecords<any>): void {
        this.records.push(record);
    }

    public store(fileName: string): Promise<any> {
        if (this.records.length === 0) {
            throw new Error("Nothing to store!");
        }

        const folder = knownFolders.documents();
        const file = folder.getFile(fileName);

        const recordsToStore = this.records.slice();
        this.clear();

        return file.writeText(JSON.stringify(recordsToStore));
    }

    private clear() {
        this.records = [];
    }
}

let _instance;
export function getStore() {
    if (!_instance)
        _instance = new Store();
    return _instance;
}

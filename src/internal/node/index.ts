import { SensorType } from "../sensors/sensor-type";

export class Node {

    constructor(
        private _id: string,
        private _name: string,
        private _capabilities?: SensorType[],
    ) {
    }

    get name(): string {
        return this._name;
    }

    get id(): string {
        return this._id;
    }

    get capabilities(): SensorType[] {
        return this._capabilities;
    }

    set capabilities(sensors: SensorType[]) {
        this._capabilities = sensors;
    }
}



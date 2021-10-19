import { Observable } from "@nativescript/core";

export class LoggerViewModel extends Observable {

    private loggedText: string = "";

    constructor() {
        super();
    }

    public logInfo(value: string) {
        this.log("[INFO]", value);
    }

    public logResult(value: string) {
        this.log("[RESULT]", value);
    }

    public logInfoForNode(nodeName: string, value: string) {
        this.log(`[INFO -- ${nodeName}]`, value);
    }

    public logResultForNode(nodeName: string, value: string) {
        this.log(`[RESULT -- ${nodeName}]`, value);
    }

    public clearLogs() {
        this.loggedText = "";
        this.notifyPropertyChange("loggedText", this.loggedText);
    }

    private log(prefix: string, value: string) {
        const result = `${this.loggedText.length !== 0 ? '\n' : ''}${prefix}: ${value}`;
        this.loggedText += result;
        this.notifyPropertyChange("loggedText", this.loggedText);
    }
}

let vm;
export function getLogger() {
    if (!vm) {
        vm = new LoggerViewModel();
    }
    return vm;
}

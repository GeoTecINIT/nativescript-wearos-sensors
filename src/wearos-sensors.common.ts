import { Observable } from "@nativescript/core";
import { taskDispatcher } from "nativescript-task-dispatcher";
import { EventData } from "nativescript-task-dispatcher/events";


export class Common extends Observable {
  init(): void {
  }

  public emitEvent(eventName: string, eventData?: EventData) {
      taskDispatcher.emitEvent(eventName, eventData);
  }

  public isReady(): Promise<boolean> {
      return taskDispatcher.isReady();
  }

  public prepare(): Promise<void> {
      return taskDispatcher.prepare();
  }
}

import { Observable } from "@nativescript/core";
import { Task } from "nativescript-task-dispatcher/tasks";
import { TaskGraph } from "nativescript-task-dispatcher/internal/tasks/graph";
import { taskDispatcher } from "nativescript-task-dispatcher";
import { internalTasks } from "./internal/tasks";
import { EventData } from "nativescript-task-dispatcher/events";


export class Common extends Observable {
  async init(
      appTasks: Array<Task>,
      taskGraph: TaskGraph
  ): Promise<void> {
      await taskDispatcher.init([...internalTasks, ...appTasks], taskGraph);
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

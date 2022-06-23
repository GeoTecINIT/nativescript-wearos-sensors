import { Task } from "nativescript-task-dispatcher/tasks";
import { RecordLoggerTask } from "~/home/tasks/record-logger-task";

export const appTasks: Array<Task> = [
    new RecordLoggerTask("recordLoggerTask"),
]

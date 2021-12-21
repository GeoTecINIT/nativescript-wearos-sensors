import { Task } from "nativescript-task-dispatcher/tasks";
import { CommandLoggerTask } from "~/home/tasks/command-logger-task";
import { RecordLoggerTask } from "~/home/tasks/record-logger-task";

export const appTasks: Array<Task> = [
    new CommandLoggerTask("commandLoggerTask"),
    new RecordLoggerTask("recordLoggerTask"),
]

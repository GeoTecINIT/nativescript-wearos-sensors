import { Task } from "nativescript-task-dispatcher/tasks";
import { CommandLoggerTask } from "~/home/tasks/command-logger-task";
import { RecordLoggerTask } from "~/home/tasks/record-logger-task";
import { MessageLoggerTask } from "~/home/tasks/message-logger-task";

export const appTasks: Array<Task> = [
    new CommandLoggerTask("commandLoggerTask"),
    new RecordLoggerTask("recordLoggerTask"),
    new MessageLoggerTask(
        "storeDataMessageLoggerTask",
        "collected data has been stored"
    ),
    new MessageLoggerTask(
        "clearDataMessageLoggerTask",
        "collected data has been deleted"
    ),
]

import { Task } from "nativescript-task-dispatcher/tasks";
import { CommandLoggerTask } from "~/home/tasks/command-logger-task";
import { RecordLoggerTask } from "~/home/tasks/record-logger-task";
import { AccumulatorTask } from "~/home/tasks/accumulator-task";
import { StoreCollectedDataTask } from "~/home/tasks/store-collected-data-task";
import { ClearCollectedDataTask } from "~/home/tasks/clear-collected-data-task";

export const appTasks: Array<Task> = [
    new CommandLoggerTask("commandLoggerTask"),
    new RecordLoggerTask("recordLoggerTask"),
    new AccumulatorTask("accumulatorTask"),
    new StoreCollectedDataTask("storeCollectedDataTask"),
    new ClearCollectedDataTask("clearCollectedDataTask"),
]

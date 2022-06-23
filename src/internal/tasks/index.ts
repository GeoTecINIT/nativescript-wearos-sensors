import { Task } from "nativescript-task-dispatcher/tasks";
import { SendSingleMessageTask } from "./send-single-message-task";

export const internalTasks: Array<Task> = [
    new SendSingleMessageTask(),
];

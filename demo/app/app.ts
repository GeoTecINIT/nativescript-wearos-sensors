import { Application } from "@nativescript/core";
import { wearosSensors } from "nativescript-wearos-sensors/wearos-sensors.android";
import { appTasks } from "~/home/tasks";
import { demoTaskGraph } from "~/home/tasks/graph";

wearosSensors.init(appTasks, demoTaskGraph);

Application.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/

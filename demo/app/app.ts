import { Application } from "@nativescript/core";
import { wearosSensors } from "../../src/wearos-sensors.android";

wearosSensors.init();

Application.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/

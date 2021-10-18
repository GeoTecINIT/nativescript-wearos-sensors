import { NavigatedData, Page } from "@nativescript/core";
import { DevicesViewModel } from "~/home/devices/devices-view-model";

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;

    page.bindingContext = new DevicesViewModel();
}

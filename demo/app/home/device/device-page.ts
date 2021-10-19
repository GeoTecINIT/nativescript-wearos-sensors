import { getViewById, NavigatedData, Page} from "@nativescript/core";
import { DeviceViewModel } from "~/home/device/device-view-model";


export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;

    page.bindingContext = new DeviceViewModel(args.context.node);
}

export function onPageLoaded(args) {
    const page = <Page>args.object;
    const repeater = getViewById(page, "repeater");

    (<DeviceViewModel>page.bindingContext).setRepeater(repeater);
}

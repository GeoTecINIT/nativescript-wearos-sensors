import { EventData, getViewById, NavigatedData, Page, ScrollView } from "@nativescript/core";
import { getLogger } from "~/home/logger/logger-view-model";

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;

    page.bindingContext = getLogger();
}

let loggerScrollView;
export function onPageLoaded(args: EventData) {
    const page = <Page>args.object;
    loggerScrollView = getViewById(page, "logger-view");
}

export function loggerTextChanged(args: EventData) {
    setTimeout(() => {
        if (loggerScrollView.scrollableHeight === 0)
            return;

        loggerScrollView.scrollToVerticalOffset(loggerScrollView.scrollableHeight, false);
    }, 50);
}

import { Frame, ItemEventData, NavigatedData, Page } from "@nativescript/core";
import { DeviceListViewModel } from "~/home/device-list/device-list-view-model";
import { Node} from "nativescript-wearos-sensors/internal/node/node.android";
import { fromString } from "nativescript-wearos-sensors/internal/sensors/sensor-type";

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;

    page.bindingContext = getViewModel();
}

export function onNodeTap(args: ItemEventData) {
    const frame = Frame.getFrameById("main-frame");
    const selectedNode = getViewModel().getNode(args.index);

    const node = new Node(
        selectedNode.id,
        selectedNode.name,
        Object.keys(selectedNode.sensorsAvailability).map((sensor) => fromString(sensor))
    );

    frame.navigate({
        moduleName: "home/device/device-page",
        context: { node: node },
    });
}

let vm;
function getViewModel() {
    if (!vm) {
        vm = new DeviceListViewModel();
    }
    return vm;
}

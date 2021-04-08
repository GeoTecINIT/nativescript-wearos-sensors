import { Node, wearOS } from "nativescript-wearos-sensors/internal/utils/android/wear-os-types.android";

export function buildFakeNode(id: string, name: string, nearby: boolean): Node {
    return new wearOS.Node({
        getId(): string {
            return id;
        },
        getDisplayName(): string {
            return name;
        },
        isNearby(): boolean {
            return nearby;
        }
    })
}

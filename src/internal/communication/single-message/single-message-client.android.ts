import { CommunicationClient } from "../communication-client.android";
import { Node } from "../../node";

export class SingleMessageClient extends CommunicationClient<any> {

    constructor(private path = "/single-message") {
        super(undefined);
    }

    public async sendResult(node: Node, result: any) {
        await this.sendMessage(node, this.path, result);
    }
}

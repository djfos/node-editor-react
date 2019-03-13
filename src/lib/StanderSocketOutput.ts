import { StanderNode } from "./StanderNode";
import { StanderSocketInput } from "./StandertSocketInpu";
import { Subject, Subscription } from "rxjs"

let gid = 30;

export class StanderSocketOutput<I, O> {
    private x: number;
    private y: number;

    output: StanderSocketInput<O, any> | null = null;
    readonly node: StanderNode
    readonly id: number = gid++;
    subject: Subject<I>
    subscription: Subscription | null = null
    constructor(obj: {
        x: number
        y: number
        node: StanderNode
    }) {
        this.x = obj.x
        this.y = obj.y

        if (!obj.node)
            throw new Error("undefind node")
        this.node = obj.node

        this.subject = new Subject()
    }


    globalX() {
        return this.x + this.node.x
    }
    globalY() {
        return this.y + this.node.y
    }

    localX() {
        return this.x
    }
    localY() {
        return this.y
    }


}

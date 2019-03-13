import { StanderNode } from "./StanderNode";
import { StanderSocketInput } from "./StandertSocketInpu";
import { Subject, Subscription } from "rxjs"

let gid = 3000;

export class StanderSocketOutput<I, O> {
    private x: number;
    private y: number;
    private output: StanderSocketInput<any, any>[] = [];
    readonly node: StanderNode
    readonly id: number = gid++;
    subject: Subject<I>
    subscription: Subscription | null = null

    constructor({ x, y, node }: {
        x: number
        y: number
        node: StanderNode
    }) {
        this.x = x
        this.y = y
        this.node = node
        this.subject = new Subject()
    }


    connect(target: StanderSocketInput<O, any>) {
        target.connect(this)
        this.output.push(target)
    }

    disconnect(target: StanderSocketInput<O, any>) {
        target.disconnect()
        this.output = this.output.filter((s) => s !== target)

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

    getOutput() {
        return this.output
    }


}

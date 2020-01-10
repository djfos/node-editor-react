import { StanderNode } from "./StanderNode"
import { StanderSocketIn } from "./StandertSocketIn"
import { BehaviorSubject, Subscription } from "rxjs"

let gid = 3000

export class StanderSocketOut<T = any> {
    x: number
    y: number
    target: StanderSocketIn<T> | null = null
    readonly subject: BehaviorSubject<T>;
    // subscription: Subscription | null = null
    readonly node: StanderNode
    readonly type = "out"
    readonly id: number = gid++


    constructor({ x, y, node, init }: {
        x: number;
        y: number;
        node: StanderNode;
        init: T;
    }) {
        this.x = x
        this.y = y
        this.node = node
        this.subject = new BehaviorSubject(init)
    }

    globalX() {
        return this.node.x + this.x
    }

    globalY() {
        return this.node.y + this.y
    }
}

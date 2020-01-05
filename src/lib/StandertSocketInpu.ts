import { StanderNode } from "./StanderNode"
import { StanderSocketOut } from "./StanderSocketOutput"
import { Subscription, BehaviorSubject } from "rxjs"

let gid = 2000


export class StanderSocketIn<T = any> {
    x: number
    y: number
    target: StanderSocketOut<T> | null = null
    readonly subject: BehaviorSubject<T>
    readonly node: StanderNode
    readonly type = "in"
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

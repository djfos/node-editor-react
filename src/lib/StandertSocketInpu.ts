import { StanderNode } from "./StanderNode";
import { StanderSocketOutput } from "./StanderSocketOutput";
import { Subject, Subscription } from "rxjs"

let gid = 2000;

/**
 * pre<any,I> --> this<I,O> --> next<O,any>
 */
export class StanderSocketInput<I, O> {
    private x: number;
    private y: number;
    private input: StanderSocketOutput<any, I> | null = null;
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
    /**
     * never use this method directly !!!
     * Only should be called inside an output socket calss !!!
     * @param target
     */
    connect(target: StanderSocketOutput<any, I>) {
        if (this.input != null) { this.input.disconnect(this) }
        this.input = target
    }
    /**
     * never use this method directly !!!
     * Only should be called inside an output socket calss !!!
     */
    disconnect() {
        this.input == null
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

    hasInput() {
        return this.input != null
    }

    getInput() {
        return this.input
    }
}

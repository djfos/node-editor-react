import { StanderNode } from "./StanderNode"
import { StanderSocketOutput } from "./StanderSocketOutput"
import { Subscription, PartialObserver } from "rxjs"

let gid = 2000

/**
 * pre<any,I> --> this<I,O> --> next<O,any>
 */
export class StanderSocketInput<I = any> {

    private x: number
    private y: number
    private input: StanderSocketOutput | null = null
    private observer: PartialObserver<I>
    private subscription: Subscription | null = null
    readonly node: StanderNode
    readonly id: number = gid++

    constructor({ x, y, node, observer }: {
        x: number
        y: number
        node: StanderNode
        observer: PartialObserver<I>
    }) {
        this.x = x
        this.y = y
        this.node = node
        this.observer = observer
    }

    /**
     * must be consisted with the gid in the declared file
     * @param id 
     */

    static is(id: number) {
        return id.toString()[0] === "2"
    }



    connect(target: StanderSocketOutput) {
        // ui
        if (this.input !== null) { this.disconnect() }
        this.input = target
        target.connect(this)

        // logic
        this.subscription = target.subject.subscribe(this.observer)
    }

    disconnect() {
        if (this.input !== null) {
            // ui
            this.input.disconnect(this)
            this.input = null
            // logic
            if (this.subscription !== null) {
                this.subscription.unsubscribe()
                this.subscription = null
            }
        }

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
        return this.input !== null
    }

    getInput() {
        return this.input
    }
}

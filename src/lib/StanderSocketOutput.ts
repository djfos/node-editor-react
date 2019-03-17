import { StanderNode } from "./StanderNode"
import { StanderSocketInput } from "./StandertSocketInpu"
import { Subject } from "rxjs"

let gid = 3000

export class StanderSocketOutput<O=any> {
    private x: number
    private y: number
    private output: StanderSocketInput[] = []
    readonly node: StanderNode
    readonly id: number = gid++
    readonly subject: Subject<O>


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
     * must be consisted with the gid in the declared file
     * @param id 
     */
    static is(id: number) {
        return id.toString()[0] === "3"
    }

    /**
     * @deprecated
     * never use this method directly !!!
     * Only should be called inside an input socket calss !!!
     */
    connect(target: StanderSocketInput) {
        this.output.push(target)
    }
    /**
     * @deprecated
     * never use this method directly !!!
     * Only should be called inside an input socket calss !!!
     */
    disconnect(target: StanderSocketInput) {
        this.output = this.output.filter((s) => s !== target)
    }


    next(val: O) {
        this.subject.next(val)
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

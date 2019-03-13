import { StanderNode } from "./StanderNode";
import { StanderSocketOutput } from "./StanderSocketOutput";
import { Subject, Subscription } from "rxjs"
let gid = 20;


//  pre<any,I> --> this<I,O> --> next<O,any> 
export class StanderSocketInput<I, O> {
    private x: number;
    private y: number;
    input: StanderSocketOutput<any, I> | null = null;

    readonly node: StanderNode
    readonly id: number = gid++;
    subject: Subject<I>
    subscription: Subscription | null = null
    foo: (inputVal: I) => O
    constructor(obj: {
        x: number
        y: number
        node: StanderNode
        foo: (inputVal: I) => O
    }) {
        this.x = obj.x
        this.y = obj.y

        if (!obj.node)
            throw new Error("undefind node")
        this.node = obj.node

        this.subject = new Subject()
        this.foo = obj.foo;
    }

    disconnect() {
        if (this.input == null)
            return

        this.input.output == null;
        if (this.subscription != null)
            this.subscription.unsubscribe()
        this.input = null;

    }


    connect(target: StanderSocketOutput<any, I>) {
        const ref = this
        this.input = target
        target.output = this
        this.subscription = target.subject.subscribe({
            next(val) { ref.subject.next(val) }
        })
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

import { StanderNode } from "./StanderNode";

let gid = 20;

export class StanderSocket {
    private x: number;
    private y: number;
    type: "in" | "out";
    in: StanderSocket | null = null;
    out: StanderSocket | null = null;
    readonly node: StanderNode
    readonly id: number = gid++;

    constructor(obj: {
        x: number
        y: number
        type: "in" | "out"
        node: StanderNode
    }) {
        this.x = obj.x
        this.y = obj.y
        this.type = obj.type
        if (!obj.node)
            throw new Error("undefind node")
        this.node = obj.node
    }

    connect(target: StanderSocket) {
        if (this.type == "in" || target.type == "out")
            return
        target.in = this;
        this.out = target;
    }

    disconnect() {
        if (this.out == null)
            return
        this.out.in = null;
        this.out = null;
    }

    getGlobalX() {
        return this.x + this.node.x
    }
    getGlobalY() {
        return this.y + this.node.y
    }

    getLocalX() {
        return this.x
    }
    getLocalY() {
        return this.y
    }
}

import React from "react"
import Node from "./Node";
import { StanderNode } from "../lib/StanderNode";
import Socket from "../component/Socket"
import { StanderSocket } from "../lib/StanderSocket";
interface IProps {
    node: MyNode
}

export function Component({ node }: IProps) {

    return (
        <Node node={node} sockets={
            (<>
                <Socket socket={node.in}></Socket>
                <Socket socket={node.out}></Socket>
            </>
            )
        }>
            <input type="text"></input>

        </Node>
    )
}

export class MyNode extends StanderNode {

    in: StanderSocket
    out: StanderSocket

    constructor() {
        super({})
        let ref = this
        this.in = new StanderSocket({
            x: 0,
            y: ref.height * 0.5,
            type: "in",
            node: ref
        })

        this.out = new StanderSocket({
            x: ref.width,
            y: ref.height * 0.5,
            type: "out",
            node: ref
        })
    }

}

export default {
    name: "mynode",
    component: Component,
    nodeClass: MyNode
}
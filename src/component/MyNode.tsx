import React from "react"
import Node from "./Node";
import { StanderNode } from "../lib/StanderNode";
import { StanderSocketInput } from "../lib/StandertSocketInpu";
import { StanderSocketOutput } from "../lib/StanderSocketOutput";
import SocketInput from "./SocketInput";
import SocketOutput from "./SocketOutput";
interface IProps {
    node: MyNode
}

export function Component({ node }: IProps) {

    return (
        <Node node={node} sockets={
            (<>
                <SocketInput socket={node.input}></SocketInput>
                <SocketOutput socket={node.output}></SocketOutput>
            </>
            )
        }>
            <input type="text"></input>

        </Node>
    )
}

export class MyNode extends StanderNode {

    input: StanderSocketInput<any, any>
    output: StanderSocketOutput<any, any>

    constructor() {
        super({})
        let ref = this
        this.input = new StanderSocketInput({
            x: 0,
            y: ref.height * 0.5,
            node: ref
        })

        this.output = new StanderSocketOutput({
            x: ref.width,
            y: ref.height * 0.5,

            node: ref
        })
    }

}

export default {
    name: "mynode",
    component: Component,
    nodeClass: MyNode
}
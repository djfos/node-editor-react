import { StanderNode } from "./StanderNode"
import MyNode from "../component/MyNode"
import { StanderSocketOutput } from "./StanderSocketOutput"
import { StanderSocketInput } from "./StandertSocketInpu"
import { TypedReducer } from "./hooks"
import { createContext } from "react"

export interface INode {
    name: string,
    component: (props: any) => JSX.Element,
    nodeInstance: StanderNode
}

export interface IStore {
    nodes: INode[]
    connectFunc: ((input: StanderSocketInput) => void) | null
}

const initState: IStore = {
    nodes: [],
    connectFunc: null,
}


const reducer = {
    move(store: IStore, target: StanderNode, mx: number, my: number): IStore {
        target.x += mx
        target.y += my
        return Object.assign({}, store)
    },
    addNode(store: IStore, typeName: string) {
        store.nodes.push({
            name: MyNode.name,
            component: MyNode.component,
            nodeInstance: new MyNode.nodeClass()
        })
        return Object.assign({}, store)
    },
    prepareConnection(store: IStore, output: StanderSocketOutput): IStore {
        store.connectFunc = (input) => {
            if (output.node === input.node) return

            input.connect(output)
        }
        return Object.assign({}, store)
    },
    performConnection(store: IStore, input: StanderSocketInput): IStore {
        if (store.connectFunc !== null) {
            store.connectFunc(input)

        }
        return Object.assign({}, store)
    },
    abordConnection(store: IStore): IStore {
        store.connectFunc = null
        return Object.assign({}, store)
    },
}

const globalContext = createContext<{ dispatch: TypedReducer<typeof reducer> } | null>(null)


export { reducer, initState, globalContext }
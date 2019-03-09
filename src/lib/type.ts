import { StanderNode } from "./StanderNode";
import { StanderSocket } from "./StanderSocket";

export interface INode {
    name: string,
    component: (props: any) => JSX.Element,
    nodeInstance: StanderNode
}

export interface IStore {
    nodes: INode[]
    connectFunc: ((to: StanderSocket) => void) | null
}

const initState: IStore = {
    nodes: [],
    connectFunc: null,
}

export { initState }








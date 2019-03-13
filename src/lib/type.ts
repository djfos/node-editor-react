import { StanderNode } from "./StanderNode";
import { StanderSocketInput } from "./StandertSocketInpu";

export interface INode {
    name: string,
    component: (props: any) => JSX.Element,
    nodeInstance: StanderNode
}

export interface IStore {
    nodes: INode[]
    connectFunc: ((input: StanderSocketInput<any, any>) => void) | null
}

const initState: IStore = {
    nodes: [],
    connectFunc: null,
}

export { initState }








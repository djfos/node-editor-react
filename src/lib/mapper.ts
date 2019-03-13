import { StanderNode } from "./StanderNode";
import { IStore } from "./type";
import MyNode from "../component/MyNode";
import { EnvType } from "./hooks";
import { StanderSocketOutput } from "./StanderSocketOutput";
import { StanderSocketInput } from "./StandertSocketInpu";

type env = EnvType<IStore> & { dispatch: typeof mapper }

const mapper = {
    move: function (this: env, { target, mx, my }: {
        target: StanderNode
        mx: number
        my: number
    }) {
        target.x += mx;
        target.y += my;
    },
    addNode: function (this: env, typeName: string) {
        console.log("add");

        this.stroe.nodes.push({
            name: MyNode.name,
            component: MyNode.component,
            nodeInstance: new MyNode.nodeClass()
        })
    },
    prepareConnection: function (this: env, output: StanderSocketOutput<any, any>) {
        this.stroe.connectFunc = (input) => {
            if (output.node === input.node) return;

            output.connect(input)
        }
    },
    performConnection: function (this: env, input: StanderSocketInput<any, any>) {
        if (this.stroe.connectFunc == null)
            return;

        this.stroe.connectFunc(input)
    },
    abordConnection: function (this: env) {
        this.stroe.connectFunc = null
    },
}

export { mapper }
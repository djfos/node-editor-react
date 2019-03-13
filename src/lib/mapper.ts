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
        console.log("prepareConnection");
        this.stroe.connectFunc = (input) => {
            if (!(output instanceof StanderSocketOutput && input instanceof StanderSocketInput))
                return;

            if (output.node === input.node)
                return;

            input.connect(output)

            console.log("performConnection");
            console.log("from " + output.id + "to" + input.id);

        }
    },
    performConnection: function (this: env, to: StanderSocketInput<any, any>) {
        if (this.stroe.connectFunc == null)
            return;

        console.log("ready performConnection");
        console.log(this.stroe.connectFunc);
        this.stroe.connectFunc(to)
    },
    abordConnection: function (this: env) {
        this.stroe.connectFunc = null
    },
}

export { mapper }
import { StanderNode } from "./StanderNode";
import { IStore } from "./type";
import MyNode from "../component/MyNode";
import { StanderSocket } from "./StanderSocket";
import { EnvType } from "./hooks";

type env = EnvType<IStore>

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
    prepareConnection: function (this: env, from: StanderSocket) {
        this.rerender(false)
        this.stroe.connectFunc = (to: StanderSocket) => {
            if (from.type != "out" || to.type != "in")
                return;

            if (from.node === to.node)
                return;

            from.connect(to)
        }
    },
    performConnection: function (this: env, to: StanderSocket) {
        if (this.stroe.connectFunc == null)
            return;

        this.stroe.connectFunc(to)
    },
    abordConnection: function (this: env) {
        this.rerender(false)
        //give some time to connect
        setTimeout(() => { this.stroe.connectFunc == null }, 500)
    },
}

export { mapper }
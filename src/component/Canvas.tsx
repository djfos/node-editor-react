import React, { useState, createContext, useContext, useMemo } from "react"
import "./global.css"
import { StanderNode } from "src/lib/StanderNode"
import { NumberGen, NumberDisplay } from "./Node"
import { StanderSocketOut } from "src/lib/StanderSocketOutput"
import { StanderSocketIn } from "src/lib/StandertSocketInpu"


interface Link {
    start: StanderSocketOut;
    end: StanderSocketIn;

}

export interface Store {
    nodes: StanderNode[];
    start: StanderSocketOut | null;
    // end: StanderSocketIn | null;
    links: Link[];
    psuedoLine: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        hide: boolean;
    };
}

const initState: Store = {
    nodes: [],
    start: null,
    // end: null,
    links: [],
    psuedoLine: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        hide: true,
    }
}

function clearLink({ links, start, end }: {
    links: Link[]; start?:
    StanderSocketOut;
    end?: StanderSocketIn;
}) {
    return links.filter(l => {
        if (start && start.id === l.start.id) {
            l.start.subscription?.unsubscribe()
            return false
        }
        if (end && end.id === l.end.id) {
            l.start.subscription?.unsubscribe()
            return false
        }
        return true
    })
}


function useStore() {
    const [store, _setStore] = useState(initState)

    const _reducer = useMemo(() => {
        return {
            move(store: Store, node: StanderNode, x: number, y: number) {
                node.x = x
                node.y = y
                _setStore(Object.assign({}, store))
            },
            addNode({ nodes }: Store, type: string): void {
                nodes.push(new StanderNode({ x: 0, y: 0, type }))
                _setStore(Object.assign({}, store))
            },
            startLink({ psuedoLine }: Store, target: StanderSocketOut) {
                //clear target
                store.links = clearLink({ links: store.links, start: target })
                //set psuedoLine
                psuedoLine.x1 = target.globalX()
                psuedoLine.y1 = target.globalY()
                psuedoLine.x2 = target.globalX()
                psuedoLine.y2 = target.globalY()
                psuedoLine.hide = false

                store.start = target
                _setStore(Object.assign({}, store))
            },
            psuedoLineMove({ psuedoLine }: Store, x: number, y: number) {
                psuedoLine.x2 = x
                psuedoLine.y2 = y
                _setStore(Object.assign({}, store))
            },
            doLink(store: Store, target: StanderSocketIn) {
                console.log(store);

                const { start } = store
                if (start !== null && target !== null) {
                    //clear target
                    store.links = clearLink({ links: store.links, end: target })
                    //buid link
                    start.subscription = target.subject.subscribe(start.subject)
                    store.links.push({ start, end: target })
                }
                store.start = null
                store.psuedoLine.hide = true
                setTimeout(() => {
                    _setStore(Object.assign({}, store))
                }, 20);

            },
            endLink(store: Store) {
                store.start = null
                store.psuedoLine.hide = true
                _setStore(Object.assign({}, store))

            },
        }
    }, [store])
    return [store, _reducer] as const
}

//取tuple的第二个元素类型
type PeekTuple2<T> = T extends readonly [unknown, infer R, ...unknown[]] ? R : never

const globalContext = createContext<{
    store: Store;
    dispatch: PeekTuple2<ReturnType<typeof useStore>>;
} | null>(null)


export function useGlobal() {
    const context = useContext(globalContext)

    if (context === null)
        throw new Error("global context is null")

    return context
}


function match(type: string) {
    switch (type) {
        case "number": return NumberGen
        case "display": return NumberDisplay
        default: return () => <div />
    }

}


export function Canvas() {
    const [store, dispatch] = useStore()

    return (
        <globalContext.Provider value={{ store, dispatch }}>

            <svg xmlns="http://www.w3.org/2000/svg"
                className="border canvas"
                tabIndex={0}
                onKeyDown={e => {
                    switch (e.key) {
                        case "a": dispatch.addNode(store, "number"); break
                        case "b": dispatch.addNode(store, "display"); break
                    }
                }}
            >
                {
                    store.psuedoLine.hide ? null :
                        React.createElement(
                            'line',
                            {
                                x1: store.psuedoLine.x1,
                                y1: store.psuedoLine.y1,
                                x2: store.psuedoLine.x2,
                                y2: store.psuedoLine.y2,
                                stroke: "black",
                                strokeWidth: "10",
                                strokeOpacity: 1.0,
                                strokeLinecap: "round",
                            }
                        )
                }

                {
                    store.links.map(l => (
                        < line
                            x1={l.start.globalX()}
                            y1={l.start.globalY()}
                            x2={l.end.globalX()}
                            y2={l.end.globalY()}
                            stroke="black"
                            strokeWidth="10"
                            strokeOpacity={1.0}
                            strokeLinecap="round"
                        ></line>
                    ))
                }

                {
                    store.nodes.map((node) => {
                        return React.createElement(
                            match(node.type),
                            {
                                node,
                                key: node.id
                            }
                        )
                    })
                }

            </svg>

        </globalContext.Provider >
    )
}








import React, { useState, createContext, useContext, useMemo, useRef } from "react"
import "./global.css"
import { StanderNode } from "src/lib/StanderNode"
import { NumberGen, NumberDisplay } from "./Node"
import { StanderSocketOut } from "src/lib/StanderSocketOut"
import { StanderSocketIn } from "src/lib/StandertSocketIn"


interface Link {
    start: StanderSocketOut;
    end: StanderSocketIn;
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
    const [nodes, setNodes] = useState<StanderNode[]>([])
    const linksRef = useRef<Link[]>([])
    const startRef = useRef<StanderSocketOut | null>(null)
    const [psuedoLineStart, setPsuedoLineStart] = useState({ x: 0, y: 0 })
    const [psuedoLineEnd, setPsuedoLineEnd] = useState({ x: 0, y: 0 })
    const [psuedoLineHide, setPsuedoLineHide] = useState(true)

    const reducer = useMemo(() => {
        return {
            move(node: StanderNode, x: number, y: number) {
                node.x = x
                node.y = y
                setNodes([...nodes])
            },
            addNode(type: string): void {
                nodes.push(new StanderNode({ x: 0, y: 0, type }))
                setNodes([...nodes])
            },
            startLink(target: StanderSocketOut) {
                //clear target
                linksRef.current = clearLink({ links: linksRef.current, start: target })
                //set psuedoLine
                const x = target.globalX()
                const y = target.globalY()
                setPsuedoLineStart({ x, y })
                setPsuedoLineEnd({ x, y })
                setPsuedoLineHide(false)
                startRef.current = target
            },
            psuedoLineMove(x: number, y: number) {
                setPsuedoLineEnd({ x, y })
            },
            doLink(target: StanderSocketIn) {
                const start = startRef.current
                if (start !== null && target !== null) {
                    console.log("doLink");

                    //clear target
                    const links = clearLink({ links: linksRef.current, end: target })
                    //buid link
                    start.subscription = start.subject.subscribe(target.subject)
                    links.push({ start, end: target })
                    linksRef.current = links
                }
                startRef.current = null
                setPsuedoLineHide(true)
            },
            endLink() {
                setTimeout(() => {
                    startRef.current = null
                    setPsuedoLineHide(true)
                }, 20);
            },
        }
    }, [])
    return [
        reducer,
        nodes, linksRef, startRef,
        psuedoLineStart, psuedoLineEnd, psuedoLineHide,
    ] as const
}


//取tuple的第二个元素类型
type PeekTupleFirst<T> = T extends readonly [infer R, ...unknown[]] ? R : never

const globalContext = createContext<{
    reducer: PeekTupleFirst<ReturnType<typeof useStore>>;
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

    const [
        reducer,
        nodes, linksRef, startRef,
        psuedoLineStart, psuedoLineEnd, psuedoLineHide,

    ] = useStore()


    return (
        <globalContext.Provider value={{ reducer }}>

            <svg xmlns="http://www.w3.org/2000/svg"
                className="border canvas"
                tabIndex={0}
                onKeyDown={e => {
                    switch (e.key) {
                        case "a": reducer.addNode("number"); break
                        case "b": reducer.addNode("display"); break
                    }
                }}
            >
                {
                    psuedoLineHide ? null :
                        React.createElement(
                            'line',
                            {
                                x1: psuedoLineStart.x,
                                y1: psuedoLineStart.y,
                                x2: psuedoLineEnd.x,
                                y2: psuedoLineEnd.y,
                                stroke: "black",
                                strokeWidth: "10",
                                strokeOpacity: 1.0,
                                strokeLinecap: "round",
                            }
                        )
                }

                {
                    linksRef.current.map(l => (
                        < line
                            x1={l.start.globalX()}
                            y1={l.start.globalY()}
                            x2={l.end.globalX()}
                            y2={l.end.globalY()}
                            stroke="black"
                            strokeWidth="10"
                            strokeOpacity={1.0}
                            strokeLinecap="round"
                            key={"" + l.start.id + l.end.id}
                        ></line>
                    ))
                }

                {
                    nodes.map((node) => {
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








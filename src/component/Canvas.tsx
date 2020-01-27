import React, { useState, createContext, useContext, useMemo, useRef, useEffect } from "react"
import "./global.css"
import { StanderNode } from "src/lib/StanderNode"
import { NumberGen, NumberDisplay } from "./CustomNodes"
import { StanderSocketOut } from "src/lib/StanderSocketOut"
import { StanderSocketIn } from "src/lib/StandertSocketIn"
import { useDrag } from "./hooks"

enum MouseButton { None = 0, Main = 1, Second = 2, Middle = 4 }

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
            l.end.subscription?.unsubscribe()
            return false
        }
        if (end && end.id === l.end.id) {
            l.end.subscription?.unsubscribe()
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

    const [translate, setTranslate] = useState({ x: 0, y: 0 })
    const [scale, setScale] = useState(1)

    const reducer = useMemo(() => {
        return {
            moveNode(node: StanderNode, x: number, y: number) {
                node.x += x
                node.y += y
                setNodes([...nodes])
            },
            addNode(type: string): void {
                nodes.push(new StanderNode({ x: 0, y: 0, type }))
                setNodes([...nodes])
            },
            onOutSocketDown(target: StanderSocketOut) {
                setPsuedoLineStart({ x: target.globalX(), y: target.globalY() })
                setPsuedoLineEnd({ x: target.globalX(), y: target.globalY() })
                setPsuedoLineHide(false)
                startRef.current = target
            },
            psuedoLineMove(deltaX: number, deltaY: number) {
                console.log(scale);

                setPsuedoLineEnd(({ x, y }) => ({ x: x + deltaX / scale, y: y + deltaY / scale }))
            },
            doLink(target: StanderSocketIn) {
                const start = startRef.current
                if (start !== null && target !== null) {
                    target.subscription = start.subject.subscribe(target.subject)
                    linksRef.current.push({ start, end: target })
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
            findLink(target: StanderSocketIn) {
                return linksRef.current.find(l => l.end.id === target.id)
            },
            onInSocketDown(link: Link) {
                linksRef.current = clearLink({ links: linksRef.current, end: link.end })
                setPsuedoLineStart({ x: link.start.globalX(), y: link.start.globalY() })
                setPsuedoLineEnd({ x: link.end.globalX(), y: link.end.globalY() })
                setPsuedoLineHide(false)
                startRef.current = link.start
            },
            translateView(deltaX: number, deltaY: number) {
                setTranslate(({ x, y }) => ({ x: x + deltaX, y: y + deltaY }))
            },
            scaleView(delta: number) {
                setScale(x => {
                    const n = x + delta * 0.01
                    if (n > 2) return 2
                    if (n < 0.5) return 0.5
                    return n
                })
            }
        }
    }, [nodes, scale])
    return [
        reducer,
        nodes, linksRef, startRef,
        psuedoLineStart, psuedoLineEnd, psuedoLineHide,
        translate, scale
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
        nodes, linksRef, ,
        psuedoLineStart, psuedoLineEnd, psuedoLineHide,
        translate, scale
    ] = useStore()

    const [viewDrag] = useDrag({
        move(e) {
            reducer.translateView(e.movementX, e.movementY)
        }
    })

    return (
        <globalContext.Provider value={{ reducer }}>

            <svg xmlns="http://www.w3.org/2000/svg"
                className="border canvas"
                style={{
                    width: 800,
                    height: 500,
                }}
                tabIndex={0}
                onKeyDown={e => {
                    switch (e.key) {
                        case "a": reducer.addNode("number"); break
                        case "b": reducer.addNode("display"); break
                    }
                }}
                onMouseDown={e => {


                    switch (e.buttons) {
                        case MouseButton.Middle:
                            viewDrag(e)
                            break
                    }
                }}
                onWheel={e => reducer.scaleView(e.deltaY)}
            >
                <g transform={`translate(${translate.x} ${translate.y}) scale(${scale} ${scale})`}>
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
                </g>
            </svg>

        </globalContext.Provider >
    )
}








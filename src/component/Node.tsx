import React, { ReactNode, useMemo, useEffect, useState } from "react"
import "./global.css"
import { useGlobal } from "./Canvas"
import { StanderNode } from "../lib/StanderNode"
import { useDrag } from "src/component/hooks"
import { SocketOut } from "./SocketOut"
import { StanderSocketOut } from "src/lib/StanderSocketOut"
import { SocketIn } from "./SocketIn"
import { StanderSocketIn } from "src/lib/StandertSocketIn"


export function NumberGen({ node }: {
    node: StanderNode;
}) {
    const { reducer: dispatch } = useGlobal()
    const width = 180
    const height = 180
    const { x, y, id } = node
    const out = useMemo(
        () => new StanderSocketOut({ x: width, y: 100, node, init: 0 }),
        [node]
    )

    const [start] = useDrag({ x: 0, y: 0, pageX: 0, pageY: 0, }, {
        move(e, temp) {
            dispatch.move(node, temp.x + e.pageX - temp.pageX, temp.y + e.pageY - temp.pageY)
        },
        down(e, temp) {
            temp.x = x
            temp.y = y
            temp.pageX = e.pageX
            temp.pageY = e.pageY
        }
    })

    return (
        <g transform={`translate(${x} ${y})`}>
            <foreignObject xmlns="http://www.w3.org/1999/xhtml"
                width={width} height={height}
            >
                <div className="border" style={{ width, height }} >
                    <div onMouseDown={start}>drag here</div>
                    <div>x:{x}</div>
                    <div>y:{y}</div>
                    <div>id:{id}</div>
                    <input type="text" onChange={(e) => {
                        const n = Number(e.target.value)
                        console.log(n);

                        out.subject.next(n)
                    }} />
                </div>

            </foreignObject>
            <SocketOut socket={out}></SocketOut>
        </g >

    )
}


export function NumberDisplay({ children, node, sockets }: {
    children?: ReactNode;
    sockets?: ReactNode;
    node: StanderNode;
}) {
    const { reducer: dispatch } = useGlobal()
    const width = 180
    const height = 180
    const { x, y, id } = node

    const sIn = useMemo(
        () => new StanderSocketIn({ x: 0, y: 150, node, init: 0 }),
        [node]
    )

    const [start] = useDrag({ x: 0, y: 0, pageX: 0, pageY: 0, }, {
        move(e, temp) {
            dispatch.move(node, temp.x + e.pageX - temp.pageX, temp.y + e.pageY - temp.pageY)
        },
        down(e, temp) {
            temp.x = x
            temp.y = y
            temp.pageX = e.pageX
            temp.pageY = e.pageY
        }
    })

    const [number, setNumber] = useState(0)

    useEffect(() => {
        const sub = sIn.subject.subscribe(n => setNumber(n))
        return () => sub.unsubscribe()
    })

    return (
        <g transform={`translate(${x} ${y})`}>
            <foreignObject xmlns="http://www.w3.org/1999/xhtml"
                width={width} height={height}
            >
                <div className="border" style={{ width, height }} >
                    <div onMouseDown={start}>drag here</div>
                    <div>x:{x}</div>
                    <div>y:{y}</div>
                    <div>id:{id}</div>
                    <div>number:{number}</div>
                </div>
            </foreignObject>
            <SocketIn socket={sIn}></SocketIn>
        </g >

    )
}


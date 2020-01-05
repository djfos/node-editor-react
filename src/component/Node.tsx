import React, { ReactNode, useMemo } from "react"
import "./global.css"
import { useGlobal } from "./Canvas"
import { StanderNode } from "../lib/StanderNode"
import { useDrag } from "src/lib/hooks"
import { SocketOut } from "./SocketOutput"
import { StanderSocketOut } from "src/lib/StanderSocketOutput"
import { SocketIn } from "./SocketInput"
import { StanderSocketIn } from "src/lib/StandertSocketInpu"


export function NumberGen({ node }: {
    node: StanderNode;
}) {
    const { store, dispatch } = useGlobal()
    const width = 180
    const height = 180
    const { x, y, id } = node
    const out = useMemo(
        () => new StanderSocketOut({ x: width, y: 100, node, init: 0 }),
        [node]
    )

    const [start] = useDrag({
        move: function (e, initX, initY, startX, startY) {
            dispatch.move(store, node, initX + e.clientX - startX, initY + e.clientY - startY)
        }
    })

    return (
        <g transform={`translate(${x} ${y})`}>
            <foreignObject xmlns="http://www.w3.org/1999/xhtml"
                width={width} height={height}
            >
                <div className="border" style={{ width, height }} >
                    <div onMouseDown={(e) => {
                        start(e, x, y)
                    }}>drag here</div>
                    <div>x:{x}</div>
                    <div>y:{y}</div>
                    <div>id:{id}</div>
                    <input type="text" />
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
    const { store, dispatch } = useGlobal()
    const width = 180
    const height = 180
    const { x, y, id } = node

    const sIn = useMemo(
        () => new StanderSocketIn({ x: 0, y: 150, node, init: 0 }),
        [node]
    )

    const [start] = useDrag({
        move: function (e, initX, initY, startX, startY) {
            dispatch.move(store, node, initX + e.clientX - startX, initY + e.clientY - startY)
        }
    })

    return (
        <g transform={`translate(${x} ${y})`}>
            <foreignObject xmlns="http://www.w3.org/1999/xhtml"
                width={width} height={height}
            >
                <div className="border" style={{ width, height }} >
                    <div onMouseDown={(e) => {
                        start(e, x, y)
                    }}>drag here</div>
                    <div>x:{x}</div>
                    <div>y:{y}</div>
                    <div>id:{id}</div>
                    <div>number:{0}</div>
                </div>
            </foreignObject>
            <SocketIn socket={sIn}></SocketIn>
        </g >

    )
}


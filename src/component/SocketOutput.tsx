import React, { ReactNode, useState } from "react"
import "./global.css"
import { StanderSocketOut } from "../lib/StanderSocketOutput"
import { useGlobal } from "./Canvas"
import { useDrag } from "src/lib/hooks"



export function SocketOut({ socket }: {
    socket: StanderSocketOut<number>;
}) {
    const { x, y, id } = socket
    const { store, dispatch } = useGlobal()

    const [start] = useDrag({
        down() {
            dispatch.startLink(store, socket)
        },
        move: function (e, initX, initY, startX, startY) {
            dispatch.psuedoLineMove(store, initX + e.clientX - startX, initY + e.clientY - startY)
        },
        up() {
            dispatch.endLink(store)
        },
    })

    return (
        <g>
            <g transform={`translate(${x} ${y})`}>
                <circle
                    cx={0} cy={0} r={10}
                    fill="yellow"
                    fillOpacity={1.0}
                    stroke="yellow"
                    strokeWidth="20"
                    strokeOpacity={1.0}
                    strokeLinecap="round"
                    onMouseDown={(e) => {
                        start(e, socket.globalX(), socket.globalY())
                    }}
                ></circle>
                {/* <text> id:{id}</text> */}
            </g>
        </g>
    )

}





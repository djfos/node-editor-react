import React, { ReactNode, useState } from "react"
import "./global.css"
import { StanderSocketOut } from "../lib/StanderSocketOut"
import { useGlobal } from "./Canvas"
import { useDrag } from "src/component/hooks"



export function SocketOut({ socket }: {
    socket: StanderSocketOut<number>;
}) {
    const { x, y, id } = socket
    const { reducer: dispatch } = useGlobal()

    const [start] = useDrag({ x: 0, y: 0, pageX: 0, pageY: 0, }, {
        move(e, temp) {
            dispatch.psuedoLineMove(temp.x + e.pageX - temp.pageX, temp.y + e.pageY - temp.pageY)
        },
        down(e, temp) {
            temp.x = x
            temp.y = y
            temp.pageX = x
            temp.pageY = y
            dispatch.onOutSocketDown(socket)
        },
        up() {
            dispatch.endLink()
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
                    onMouseDown={start}
                ></circle>
                {/* <text> id:{id}</text> */}
            </g>
        </g>
    )

}





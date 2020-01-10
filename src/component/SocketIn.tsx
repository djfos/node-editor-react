import React, { ReactNode, useState } from "react"
import "./global.css"
import { StanderSocketIn } from "../lib/StandertSocketIn"
import { useGlobal } from "./Canvas"
import { useDrag } from "./hooks"


export function SocketIn({ socket }: {
    socket: StanderSocketIn<number>;
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
                    stroke="red"
                    strokeWidth="20"
                    strokeOpacity={1.0}
                    strokeLinecap="round"
                    onMouseUp={() => dispatch.doLink(socket)}
                    onMouseDown={e => {
                        const link = dispatch.findLink(socket)
                        if (link === undefined) return
                        dispatch.onInSocketDown(link)
                        start(e)
                    }}
                ></circle>
                {/* <text> id:{id}</text> */}
            </g>
        </g>
    )
}





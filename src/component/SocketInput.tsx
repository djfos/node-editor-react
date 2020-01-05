import React, { ReactNode, useState } from "react"
import "./global.css"
import { StanderSocketIn } from "../lib/StandertSocketInpu"
import { useGlobal } from "./Canvas"


export function SocketIn({ socket }: {
    socket: StanderSocketIn<number>;
}) {
    const { x, y, id } = socket
    const { store, dispatch } = useGlobal()

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
                    onMouseUp={() => dispatch.doLink(store, socket)}
                ></circle>
                {/* <text> id:{id}</text> */}
            </g>
        </g>
    )
}





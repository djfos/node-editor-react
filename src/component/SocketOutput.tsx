import React, { ReactNode, useState } from "react"
import "./global.css"
import { useGlobal, useDragLine, useDrag } from "../lib/hooks";
import { StanderSocketOutput } from "../lib/StanderSocketOutput";

interface IProps {
    children?: ReactNode
    r?: number
    socket: StanderSocketOutput<any, any>
}

export default function ({ socket, r = 10 }: IProps) {
    const { id } = socket
    const localX = socket.localX()
    const localY = socket.localY()
    const [line, start, setStart, setEnd] = useDragLine()
    const { dispatch } = useGlobal()

    const startDrag = useDrag({
        down: () => {
            dispatch.prepareConnection(socket)
            setStart(localX, localY)
            setEnd(localX, localY)
            start()
        },
        up: () => {
            setStart(0, 0)
            setEnd(0, 0)
            dispatch.abordConnection()
        },
    })

    return (
        <g>
            <g transform={`translate(${localX} ${localY})`}>
                <circle cx={0} cy={0} r={r}
                    onMouseDown={mouseDownHandler}
                    className="socket"
                > </circle>
                <text> id:{id}</text>
            </g>

            {//for connection
                socket.output != null ?
                    <line x1={localX} y1={localY}
                        x2={socket.output.globalX() - socket.node.x}
                        y2={socket.output.globalY() - socket.node.y}
                        stroke="black">
                    </line> :
                    null
            }

            {/*  for drag animation */}
            {line}
        </g>
    )

    function mouseDownHandler(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        startDrag({})
    }
}





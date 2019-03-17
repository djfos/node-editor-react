import React, { ReactNode, useState } from "react"
import "./global.css"
import { StanderSocketInput } from "../lib/StandertSocketInpu"
import { useGlobal, useDrag, useDragLine } from "../lib/hooks"

interface IProps {
    children?: ReactNode
    r?: number
    socket: StanderSocketInput
}

export default function ({ socket, r = 10 }: IProps) {
    const { node, id } = socket
    const input = socket.getInput()
    const localX = socket.localX()
    const localY = socket.localY()
    const { dispatch } = useGlobal()
    const [line, start, setStart, setEnd] = useDragLine()

    const startDrag = useDrag({
        down: () => {
            if (input !== null) {
                setStart(input.globalX() - node.x, input.globalY() - node.y)
                setEnd(localX, localY)
                socket.disconnect()
                dispatch.prepareConnection(input)
                start()
            }
        },
        up: () => {
            // make line invisible
            setStart(0, 0)
            setEnd(0, 0)
            dispatch.abordConnection()
        },
    })

    return (
        <g>
            <g transform={`translate(${localX} ${localY})`}>
                <circle cx={0} cy={0} r={r}
                    className="socket"
                    onMouseUp={mouseUpHandler}
                    onMouseDown={mouseDownHandler}
                > </circle>
                <text> id:{id}</text>
            </g>
            {/*  for drag animation */}
            {line}
        </g>
    )

    function mouseUpHandler() {
        dispatch.performConnection(socket)
    }

    function mouseDownHandler(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        startDrag()
    }

}





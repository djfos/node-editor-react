import React, { ReactNode, useState } from "react"
import "./global.css"
import { StanderSocketInput } from "../lib/StandertSocketInpu";
import { useGlobal, useDrag, useDragLine } from "../lib/hooks";

interface IProps {
    children?: ReactNode
    r?: number
    socket: StanderSocketInput<any, any>
}

export default function ({ socket, r = 10 }: IProps) {
    const { input, node, id } = socket
    const localX = socket.localX()
    const localY = socket.localY()
    const { dispatch } = useGlobal()
    const [line, startDrag, setStart, setEnd] = useDragLine()

    const startDrag1 = useDrag({
        down: () => {
            if (input != null) {

                setStart(input.globalX() - node.x, input.globalY() - node.y)
                setEnd(localX, localY)
                dispatch.prepareConnection(input)
                input.output = null
                socket.input = null

                startDrag()
            }
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
        if (input != null) {
            startDrag1({})
        }
    }

}




import React, { ReactNode, useState } from "react"
import "./global.css"
import { useGlobal } from "../lib/hooks";
import { StanderSocket } from "../lib/StanderSocket";

interface IProps {
    children?: ReactNode
    r?: number
    socket: StanderSocket
}

export default function ({ socket, r = 10 }: IProps) {
    const x = socket.getLocalX()
    const y = socket.getLocalY()
    const type = socket.type
    let [x2, setX2] = useState(x);
    let [y2, setY2] = useState(y);
    const { dispatch } = useGlobal()


    return (
        <g>
            <circle cx={x} cy={y} r={r}
                onMouseDown={add}
                onMouseUp={connect}
                className="socket"
            > </circle>
            {//for connection
                type == "out" && socket.out != null ?
                    <line x1={x} y1={y}
                        x2={socket.out.getGlobalX() - socket.node.x}
                        y2={socket.out.getGlobalY() - socket.node.y}
                        stroke="black">
                    </line> :
                    null
            }

            {// for drag animation
                type == "out" ?
                    <line x1={x} y1={y} x2={x2} y2={y2} stroke="red"></line> :
                    null
            }
        </g>
    )

    function draw(e: MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        setX2(pre => pre + e.movementX)
        setY2(pre => pre + e.movementY)
    }

    function clean(e: MouseEvent) {
        document.removeEventListener("mousemove", draw)
        document.removeEventListener("mouseup", clean)
        //reset
        setX2(x)
        setY2(y)
        dispatch.abordConnection()
    }

    function add() {
        if (type == "in")
            return
        document.addEventListener("mousemove", draw)
        document.addEventListener("mouseup", clean)
        dispatch.prepareConnection(socket)
    }

    function connect() {
        console.log("performConnection:" + socket.id);

        dispatch.performConnection(socket)
    }
}





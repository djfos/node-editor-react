import React, { ReactNode } from "react"
import "./global.css"
import { useGlobal } from "../lib/hooks";
import { StanderNode } from "../lib/StanderNode";


interface IProps {
    children?: ReactNode
    sockets?: ReactNode
    node: StanderNode
}

export default function ({ children, node, sockets }: IProps) {
    const { dispatch } = useGlobal();

    const { x, y, width, height } = node

    return (
        <g transform={`translate(${x} ${y})`}>
            <g>
                {sockets}
            </g>
            <foreignObject xmlns="http://www.w3.org/1999/xhtml"

                width={width} height={height}
                onMouseDown={add}>
                <div>x:{x}</div>
                <div>y:{y}</div>
                {children}
            </foreignObject>
        </g >

    )

    function move(e: MouseEvent) {
        e.preventDefault()
        e.stopPropagation()

        dispatch.move({
            target: node,
            mx: e.movementX,
            my: e.movementY
        })

    }

    function clean() {
        document.removeEventListener("mousemove", move)
        document.removeEventListener("mouseup", clean)
    }

    function add() {
        document.addEventListener("mousemove", move)
        document.addEventListener("mouseup", clean)
    }

}

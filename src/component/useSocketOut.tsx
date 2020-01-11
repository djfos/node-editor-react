import React, { ReactNode, useState } from "react"
import "./global.css"
import { StanderSocketOut } from "../lib/StanderSocketOut"
import { useGlobal } from "./Canvas"
import { useDrag } from "src/component/hooks"



export function useSocketOut<T>(socket: StanderSocketOut<T>) {
    const { x, y } = socket
    const { reducer: dispatch } = useGlobal()

    const [start] = useDrag({ x: 0, y: 0, pageX: 0, pageY: 0, }, {
        move(e, temp) {
            dispatch.psuedoLineMove(temp.x + e.pageX - temp.pageX, temp.y + e.pageY - temp.pageY)
        },
        down(_, temp) {
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

    return [start] as const

}





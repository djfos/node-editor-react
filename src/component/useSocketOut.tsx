import React from "react"
import "./global.css"
import { StanderSocketOut } from "../lib/StanderSocketOut"
import { useGlobal } from "./Canvas"
import { useDrag } from "src/component/hooks"



export function useSocketOut<T>(socket: StanderSocketOut<T>) {
    const { reducer: dispatch } = useGlobal()

    const [start] = useDrag({
        move(e) {
            dispatch.movePsuedoLine(e.movementX, e.movementY)
        },
        down() {
            dispatch.outSocketDown(socket)
        },
        up() {
            dispatch.endLink()
        },
    })

    return [start] as const

}





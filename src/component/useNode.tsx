import React from "react"
import "./global.css"
import { useGlobal } from "./Canvas"
import { StanderNode } from "../lib/StanderNode"
import { useDrag } from "src/component/hooks"


export function useNode(node: StanderNode) {
    const { reducer: dispatch } = useGlobal()
    const [start] = useDrag({
        move(e) {
            dispatch.moveNode(node, e.movementX, e.movementY)
        },
    })
    return [start] as const
}




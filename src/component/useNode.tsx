import React, { useMemo, useEffect, useState } from "react"
import "./global.css"
import { useGlobal } from "./Canvas"
import { StanderNode } from "../lib/StanderNode"
import { useDrag } from "src/component/hooks"
import { StanderSocketIn } from "src/lib/StandertSocketIn"
import { useSocketIn } from "./useSocketIn"


export function useNode(node: StanderNode) {
    const { reducer: dispatch } = useGlobal()
    const { x, y } = node
    const [start] = useDrag({ x: 0, y: 0, pageX: 0, pageY: 0, }, {
        move(e, temp) {
            dispatch.move(node, temp.x + e.pageX - temp.pageX, temp.y + e.pageY - temp.pageY)
        },
        down(e, temp) {
            temp.x = x
            temp.y = y
            temp.pageX = e.pageX
            temp.pageY = e.pageY
        }
    })
    return [start] as const
}




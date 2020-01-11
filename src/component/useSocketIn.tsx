import React, { useCallback } from "react"
import "./global.css"
import { StanderSocketIn } from "../lib/StandertSocketIn"
import { useGlobal } from "./Canvas"
import { useDrag } from "./hooks"


export function useSocketIn<T>(socket: StanderSocketIn<T>) {
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
        },
        up() {
            dispatch.endLink()
        },
    })

    const pickUp = useCallback((e: React.MouseEvent) => {
        const link = dispatch.findLink(socket)
        if (link === undefined) return
        dispatch.onInSocketDown(link)
        start(e)
    }, [dispatch, socket, start])

    const doLink = () => dispatch.doLink(socket)

    return [pickUp, doLink] as const
}





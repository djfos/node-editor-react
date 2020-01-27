import React, { useCallback } from "react"
import "./global.css"
import { StanderSocketIn } from "../lib/StandertSocketIn"
import { useGlobal } from "./Canvas"
import { useDrag } from "./hooks"


export function useSocketIn<T>(socket: StanderSocketIn<T>) {
    const { reducer: dispatch } = useGlobal()

    const [start] = useDrag({
        move(e) {
            dispatch.psuedoLineMove(e.movementX, e.movementY)
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





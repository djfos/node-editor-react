import React, { useCallback, useState, useEffect } from "react"

const emptyfunc = () => null

export function useDrag({
    move = emptyfunc,
    up = emptyfunc,
    down = emptyfunc,

}: {
    move?: (e: MouseEvent, initX: number, initY: number, startX: number, startY: number) => void;
    up?: (e: MouseEvent, ) => void;
    down?: () => void;
}) {
    const start = useCallback(function (e: React.MouseEvent, initX: number, initY: number) {
        const startX = e.clientX
        const startY = e.clientY
        const _initX = initX
        const _initY = initY
        // console.log(`${startX}, ${startY}, ${_initX} ,${_initY},`);

        down()

        const wrap = function (e: MouseEvent) {
            e.preventDefault()
            // e.stopPropagation()
            move(e, _initX, _initY, startX, startY)
        }

        const clean = function (e: MouseEvent) {
            up(e)
            document.removeEventListener("mousemove", wrap)
            document.removeEventListener("mouseup", clean)
        }
        document.addEventListener("mousemove", wrap)
        document.addEventListener("mouseup", clean)
    }, [up, down, move])

    return [start] as const
}

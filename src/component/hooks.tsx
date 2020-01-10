import React, { useCallback, useState, useEffect } from "react"

export function useDrag<T>(temp: T, { move, up, down, }: {
    move?: (e: MouseEvent, temp: T) => void;
    up?: (e: MouseEvent, temp: T) => void;
    down?: (e: React.MouseEvent, temp: T) => void;
}) {
    const start = useCallback(function (e: React.MouseEvent) {
        down?.(e, temp)

        const wrap = function (e: MouseEvent) {
            e.preventDefault()
            // e.stopPropagation()
            move?.(e, temp)
        }

        const clean = function (e: MouseEvent) {
            up?.(e, temp)
            document.removeEventListener("mousemove", wrap)
            document.removeEventListener("mouseup", clean)
        }
        document.addEventListener("mousemove", wrap)
        document.addEventListener("mouseup", clean)
    }, [down, temp, move, up])

    return [start] as const
}

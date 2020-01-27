import React, { useCallback } from "react"

export function useDrag({ move, up, down, }: {
    move?: (e: MouseEvent) => void;
    up?: (e: MouseEvent) => void;
    down?: (e: React.MouseEvent) => void;
}) {
    const start = useCallback(function (e: React.MouseEvent) {
        down?.(e)

        const wrap = function (e: MouseEvent) {
            e.preventDefault()
            e.stopPropagation()
            move?.(e)
        }

        const clean = function (e: MouseEvent) {
            up?.(e)
            document.removeEventListener("mousemove", wrap)
            document.removeEventListener("mouseup", clean)
        }
        document.addEventListener("mousemove", wrap)
        document.addEventListener("mouseup", clean)
    }, [down, move, up])

    return [start] as const
}

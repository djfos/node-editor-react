import React, { useContext, useReducer, useMemo, useState, useCallback } from "react"
import { globalContext } from "./reducer"

// ====================================================================================

export function useGlobal() {
    const context = useContext(globalContext)

    if (context === null)
        throw new Error("global context is null")

    return context
}

// ====================================================================================
// rebuild a wheel after rematch :D

interface Reducer<S> {
    [key: string]: (state: S, ...arg: any[]) => any
}

export type TypedReducer<T extends Reducer<any>> = {
    [K in keyof T]: T[K] extends ((state: any, ...arg: infer A) => infer R) ? (...arg: A) => R : never
}

interface Mapper {
    [key: string]: (this: any, ...arg: any[]) => any
}

export function useBetterReducer<M extends Mapper, S>(reducer: M, init: S): [S, TypedReducer<M>] {
    const _reducer = useMemo<React.Reducer<S, any>>(() => (s, a) => {
        return reducer[a.type].call(proxy, s, ...a.data)
    }, [reducer, init])

    const [store, dispatch] = useReducer(_reducer, init)

    const proxy: any = useMemo(() => new Proxy(reducer, {
        get: function (target, name) {
            if (name in target) {
                return function (...arg: any[]) {
                    dispatch({
                        type: name,
                        data: arg
                    })
                }
            }
        }
    }), [reducer, init])

    return [store, proxy]
}
// ==============================================================================

const emptyfunc = () => { }

export function useDrag<T>({
    move = emptyfunc,
    up = emptyfunc,
    down = emptyfunc,
}: {
    move?: (e: MouseEvent, payload?: T) => void
    up?: (e: MouseEvent, payload?: T) => void
    down?: (payload?: T) => void
}) {

    const start = useCallback(function (payload?: T) {
        down(payload)

        const wrap = function (e: MouseEvent) {
            move(e, payload)
        }

        const clean = function (e: MouseEvent) {
            up(e, payload)
            document.removeEventListener("mousemove", wrap)
            document.removeEventListener("mouseup", clean)
        }
        document.addEventListener("mousemove", wrap)
        document.addEventListener("mouseup", clean)
    }, [move, up, down])

    return start
}

// ================================================================

type SetPointFunc = (a: number, b: number) => void

export function useDragLine(): [JSX.Element, (...arg: any[]) => any, SetPointFunc, SetPointFunc] {

    const [_startX, _setStartX] = useState(0)
    const [_startY, _setStartY] = useState(0)
    const [_endX, _setEndX] = useState(0)
    const [_endY, _setEndY] = useState(0)

    const _start = useDrag({
        move: (e, _) => {
            _setEndX(pre => pre + e.movementX)
            _setEndY(pre => pre + e.movementY)
        }
    })

    const setStartPoint = (_startX: number, _startY: number) => {
        _setStartX(_startX)
        _setStartY(_startY)
    }

    const setEndPoint = (_endX: number, _endY: number) => {
        _setEndX(_endX)
        _setEndY(_endY)
    }

    /*  for drag animation */
    const line = <line x1={_startX} y1={_startY} x2={_endX} y2={_endY} stroke="red" ></line >

    return [line, _start, setStartPoint, setEndPoint]
}
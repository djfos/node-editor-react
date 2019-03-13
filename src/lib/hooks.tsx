import React, { useContext, useReducer, useMemo, useState, useCallback } from "react";
import globalContext from "./globalContext"

export function useGlobal() {
    const context = useContext(globalContext)

    if (context == null)
        throw new Error("global context is null")

    return context
}

//====================================================================================

interface Mapper {
    [key: string]: (this: any, ...arg: any[]) => any
}

type ParameterType<T extends (...arg: any[]) => any> = T extends (this: any, ...args: infer R) => any ? R : never
// type ThisType<T extends (...arg: any[]) => any> = T extends (this: infer R, ...args: any[]) => any ? R : never

export type TypedMapper<M extends Mapper> = {
    [K in keyof M]: (...arg: ParameterType<M[K]>) => ReturnType<M[K]>
    // [K in keyof M]: M[K]
}

export type EnvType<S> = {

    stroe: S,

    /**
     * default true
     */
    rerender: (reredner: boolean) => void
}

export function useBetterReducer<M extends Mapper, S>(mapper: M, init: S): [S, TypedMapper<M>] {

    const cleanMapper = useMemo<M>(() => {
        return Object.setPrototypeOf(mapper, null)
    }, [mapper])

    const reducer = useMemo<React.Reducer<S, any>>(() => (s, a) => {
        //not here imuteable
        let reredner = true;
        const env = {
            stroe: s,
            dispatch: proxy,
            rerender: (reredner: boolean) => { reredner = reredner }
        }

        cleanMapper[a.type].apply(env, a.data)

        return reredner ? Object.assign({}, s) : s
    }, [cleanMapper])


    const [store, dispatch] = useReducer(reducer, init)

    const proxy = useMemo(() => new Proxy(cleanMapper, {
        get: function (target, name) {
            if (name in target) {


                let a = function (...arg: any[]) {


                    dispatch({
                        type: name,
                        data: arg
                    })
                }

                let b = a.bind(store)

                return b;

            }
        }
    }), [cleanMapper])

    return [store, proxy];
}

//==============================================================================

const emptyfunc = () => { }
export function useDrag<T>({
    move = emptyfunc,
    up = emptyfunc,
    down = emptyfunc,
}: {
    move?: (payload: T, e: MouseEvent) => void
    up?: (payload: T, e: MouseEvent) => void
    down?: (payload: T) => void
}) {

    const start: (payload: T) => void = useCallback(function (arg) {
        down(arg)

        const wrap = function (e: MouseEvent) {
            move(arg, e)
        }

        const clean = function (e: MouseEvent) {
            up(arg, e)
            document.removeEventListener("mousemove", wrap)
            document.removeEventListener("mouseup", clean)
        }
        document.addEventListener("mousemove", wrap)
        document.addEventListener("mouseup", clean)
    }, [move, up, down])

    return start
}

//================================================================

type setPointFunc = (a: number, b: number) => void
export function useDragLine(
): [JSX.Element, (...arg: any[]) => any, setPointFunc, setPointFunc] {

    const [_startX, _setStartX] = useState(0);
    const [_startY, _setStartY] = useState(0);
    const [_endX, _setEndX] = useState(0);
    const [_endY, _setEndY] = useState(0);

    const _start = useDrag({
        move: (_, e) => {
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
import { useContext, useReducer, useMemo } from "react";
import globalContext from "./globalContext"

export function useGlobal() {
    const context = useContext(globalContext)

    if (context == null)
        throw new Error("global context is null")

    return context
}

type Mapper<T> = {
    [key: string]: (this: T, ...arg: any[]) => any
}

type ParameterType<T extends (...arg: any[]) => any> = T extends (this: any, ...args: infer R) => any ? R : never
// type ThisType<T extends (...arg: any[]) => any> = T extends (this: infer R, ...args: any[]) => any ? R : never

export type TypedMapper<M extends Mapper<EnvType<S>>, S> = {
    [K in keyof M]: (...arg: ParameterType<M[K]>) => ReturnType<M[K]>
}

export type EnvType<S> = {
    stroe: S,
    /**
     * default true
     */
    rerender: (reredner: boolean) => void
}

export function useBetterReducer<M extends Mapper<EnvType<S>>, S>(mapper: M, init: S): [S, TypedMapper<M, S>] {

    const cleanMapper = useMemo<M>(() => {
        return Object.setPrototypeOf(mapper, null)
    }, [mapper])

    const reducer = useMemo<React.Reducer<S, any>>(() => (s, a) => {
        //not here imuteable
        let reredner = true;
        const env = {
            stroe: s,
            rerender: (reredner: boolean) => { reredner = reredner }
        }
        cleanMapper[a.type].apply(env, a.data)

        return reredner ? Object.assign({}, s) : s
    }, [cleanMapper])


    const [store, dispatch] = useReducer(reducer, init)

    const proxy = useMemo(() => new Proxy(cleanMapper, {
        get: function (target, name) {
            if (name in target) {
                // console.log(name);

                let a = function (...arg: any[]) {
                    // console.log("disp");

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
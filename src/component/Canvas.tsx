import React, { useState } from "react"
import "./global.css"
import { useBetterReducer } from "../lib/hooks"
import { reducer, initState, globalContext } from "../lib/reducer"

export default function () {
    const [store, dispatch] = useBetterReducer(reducer, initState)

    return (
        <globalContext.Provider value={{ dispatch }}>
            <div tabIndex={0}
                onKeyDown={e => {
                    switch (e.key) {
                        case "a":
                            dispatch.addNode("xxx")
                    }
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg"
                    className="border canvas"
                >
                    {store.nodes.map(node => (
                        <node.component
                            node={node.nodeInstance}
                            key={node.nodeInstance.id}
                        ></node.component>)
                    )}
                </svg>
            </div>
        </globalContext.Provider >
    )
}




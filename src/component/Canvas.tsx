import React, { useState } from "react"
import "./global.css"
import GlobalContext from "../lib/globalContext";
import { initState } from "../lib/type"
import { useBetterReducer } from "../lib/hooks";
import { mapper } from "../lib/mapper"

export default function () {
    const [store, dispatch] = useBetterReducer(mapper, initState)

    return (
        <GlobalContext.Provider value={{
            store,
            dispatch,
            connectFunc: null
        }}>
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
        </GlobalContext.Provider >
    )
}




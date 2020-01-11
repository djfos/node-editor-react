import React, { useMemo, useState, useEffect } from "react";
import { StanderNode } from "../lib/StanderNode";
import { StanderSocketOut } from "src/lib/StanderSocketOut";
import { useSocketOut } from "./useSocketOut";
import { useNode } from "./useNode";
import { StanderSocketIn } from "src/lib/StandertSocketIn";
import { useSocketIn } from "./useSocketIn";
export function NumberGen({ node }: {
    node: StanderNode;
}) {
    const width = 180;
    const height = 180;
    const { x, y, id } = node;
    const sOut = useMemo(
        () => new StanderSocketOut({ x: width, y: 100, node, init: 0 }),
        [node]
    );
    const [startNode] = useNode(node);
    const [startSocket] = useSocketOut(sOut);
    return (<g transform={`translate(${x} ${y})`}>
        <foreignObject xmlns="http://www.w3.org/1999/xhtml" width={width} height={height}>
            <div className="border" style={{ width, height }}>
                <div onMouseDown={startNode}>drag here</div>
                <div>x:{x}</div>
                <div>y:{y}</div>
                <div>id:{id}</div>
                <input type="text" onChange={(e) => {
                    const n = Number(e.target.value);
                    console.log(n);
                    sOut.subject.next(n);
                }} />
            </div>

        </foreignObject>
        <g transform={`translate(${sOut.x} ${sOut.y})`}>
            <circle
                cx={0} cy={0} r={10}
                fill="yellow"
                stroke="red"
                strokeWidth="5"
                strokeLinecap="round"
                onMouseDown={startSocket}
            ></circle>
        </g>
    </g>);
}


export function NumberDisplay({ node }: {
    node: StanderNode;
}) {
    const width = 180
    const height = 180
    const { x, y, id } = node

    const sIn = useMemo(
        () => new StanderSocketIn({ x: 0, y: 150, node, init: 0 }),
        [node]
    )

    const [startNode] = useNode(node)
    const [pickUp, doLink] = useSocketIn(sIn)
    const [number, setNumber] = useState(0)

    useEffect(() => {
        const sub = sIn.subject.subscribe(n => setNumber(n))
        return () => sub.unsubscribe()
    })

    return (
        <g transform={`translate(${x} ${y})`}>
            <foreignObject xmlns="http://www.w3.org/1999/xhtml"
                width={width} height={height}
            >
                <div className="border" style={{ width, height }}>
                    <div onMouseDown={startNode}>drag here</div>
                    <div>x:{x}</div>
                    <div>y:{y}</div>
                    <div>id:{id}</div>
                    <div>number:{number}</div>
                </div>
            </foreignObject>
            <g transform={`translate(${sIn.x} ${sIn.y})`}
                onMouseUp={doLink}
                onMouseDown={pickUp}>
                <circle
                    cx={0} cy={0} r={10}
                    fill="yellow"
                    stroke="red"
                    strokeWidth="20"
                    strokeLinecap="round"
                ></circle>
            </g>
        </g >
    )
}

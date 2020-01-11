# (Under Development)
# What is this?

### A typed node editor 

# How to use? (Envisage)

### put the canvas in

``` jsx
import {Canvas} from ...

export default function App() {
  return (
    <Canvas></Canvas>
  );
}

//TODO: need a menu to work

```

### defind your own nodes

``` jsx
import {useNode,useSocketOut,useSocketIn} from ...



export function NumberGen(node: StanderNode) {
    //put on where you want to darg node around
    const [startNode] = useNode(node);
    //put on where the socket are 
    const [startSocket] = useSocketOut(sOut);

  return (
      <div onMouseDown={startNode}><div/>
      <circle onMouseDown={startSocket}></circle>
  );
}

export function Display(node: StanderNode) {
    const [startNode] = useNode(node);
    const [startSocket] = useSocketIn(sIn);

  return (
      <div onMouseDown={startNode}><div/>
      <circle onMouseDown={startSocket}></circle>
  );
}

```
### see more detail in the CustomNodes.tsx under src/component
# MIT License



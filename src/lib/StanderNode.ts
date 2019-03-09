
let gid = 0

export class StanderNode {
    x: number
    y: number
    readonly id: number = gid++
    width: number
    height: number


    constructor({ x = 0, y = 0, width = 120, height = 180 }: {
        x?: number
        y?: number
        width?: number
        height?: number
    }) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
}

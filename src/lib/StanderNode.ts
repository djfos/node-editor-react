
let gid = 1000

export class StanderNode {
    x: number
    y: number
    readonly id: number = gid++
    readonly type: string


    constructor({ x = 0, y = 0, type }: {
        x?: number;
        y?: number;
        type: string;

    }) {
        this.x = x
        this.y = y
        this.type = type
    }
}

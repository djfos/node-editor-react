
type ParameterType<T extends (...arg: any[]) => any> = T extends (...args: infer R) => any ? R : never
type callback = (...arg: any[]) => void
type Pick<T, K extends keyof T> = T[K]
type Keys<E extends Event> = Pick<E, "name">
type Callbacks<E extends Event> = Pick<E, "callback">

export interface Event {
    name: string
    callback: callback
}

let gid = 10;

export class EventEmitter<E extends Event> {
    private map = new Map<string, callback[]>()
    public id = gid++;
    on(event: Keys<E>, listener: Callbacks<E>) {
        if (!this.map.has(event)) {
            this.map.set(event, [])
        }
        this.map.get(event)!.push(listener)
    }

    off(event: Keys<E>) {
        this.map.delete(event)
    }

    emit(event: Keys<E>, ...payload: ParameterType<Callbacks<E>>) {
        let listeners = this.map.get(event)
        if (listeners == undefined)
            return

        for (const listener of listeners) {
            listener.call(this, ...payload)
        }
    }
};
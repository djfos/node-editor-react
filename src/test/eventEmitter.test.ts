import { EventEmitter } from "../lib/eventEmitter";

it("singel event", () => {
    let output = ""

    let ee = new EventEmitter()

    ee.on("addone", () => {
        output += 1
    })

    ee.emit("addone")

    expect(output).toEqual("1")
})

it("multi event", () => {
    let output = ""

    let ee = new EventEmitter()

    ee.on("addone", () => {
        output += 1
    })

    ee.on("addtwo", () => {
        output += 2
    })

    ee.emit("addone")
    ee.emit("addtwo")
    ee.emit("addone")


    expect(output).toEqual("121")
})

it("remove event", () => {
    let output = ""

    let ee = new EventEmitter()

    ee.on("addone", () => {
        output += 1
    })

    ee.off("addone")
    ee.emit("addone")

    expect(output).toEqual("")
})

it("pass patameters", () => {
    let output = ""

    let ee = new EventEmitter()

    ee.on("addone", (a, b) => {
        output += a
        output += b
    })

    ee.off("addone")
    ee.emit("addone", 1, 2)

    expect(output).toEqual("12")
})


export default undefined
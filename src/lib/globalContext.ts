import { createContext } from "react"
import { IStore } from "./type"
import { mapper } from "./mapper";
import { TypedMapper } from "./hooks";

export default createContext<{
    store: IStore
    dispatch: TypedMapper<typeof mapper>
} | null>(null);
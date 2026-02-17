import React, { createContext, useContext, useEffect, useState } from "react"
import { loadState, saveState, FirstWorkoutState } from "./storage"

const Context = createContext<{
    state: FirstWorkoutState
    setState: React.Dispatch<React.SetStateAction<FirstWorkoutState>>
} | null>(null)

export const FirstWorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState(loadState)

    useEffect(() => saveState(state), [state])

    return (
        <Context.Provider value={{ state, setState }}>
            {children}
        </Context.Provider>
    )
}

export const useFirstWorkoutContext = () => {
    const ctx = useContext(Context)
    if (!ctx) throw new Error("FirstWorkoutProvider missing")
    return ctx
}

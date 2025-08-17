export const SETTINGS = {
    EMPTY: "",
    ZERO: "0",
    DZERO: "00",
    MEMORY: {
        M: "M",
        MCLEAR: "MC",
        MREAD: "MR",
        MSAVE: "MS",
        MPLUS: "M+",
        MMINUS: "M-"
    },
    CONTROLS: {
        RESET: "reset",
        BACKSPACE: "backsp",
        SQROOT: "sqrt",
        POWER2: "^2",
        NEGATE: "negate",
        FLPOINT: ".",
        EQUALS: "=",
        PLUS: "+",
        MINUS: "-",
        MULTIPLY: "*",
        DIVIDE: "/",
        MODULUS: "%"
    }
}

export const digitsRegex = /^\d{0,2}$/
export const operationsRegex = /^[+\-*\/%]$/

export type SingleCalculation = { A: string, operation: string, B: string, equalsProc: boolean }
export type OutputSet = {
    outputScreen: HTMLSpanElement | null,
    outputOperation: HTMLSpanElement | null,
    otputMemory: HTMLSpanElement | null
}
/**
 * @file settings.ts
 * @description Shared constants, regex patterns, and type definitions for calculator logic and UI bindings.
 * @author Stanislav Snisar
 * @version 1.1.0
 * @created 08.2025
 * @module settings
 */

/**
 * Centralized constants for calculator behavior, control labels, and memory operations.
 */
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

/**
 * Matches digit input per button click, allowing up to two digits (e.g., "0", "00").
 */
export const digitsRegex = /^\d{0,2}$/

/**
 * Matches supported arithmetic operation symbols.
 */
export const operationsRegex = /^[+\-*\/%]$/

/**
 * Represents the current calculation state, including operands, selected operation, and result flag.
 */
export type SingleCalculation = { A: string, operation: string, B: string, equalsProc: boolean }

/**
 * References to calculator output elements in the DOM.
 */
export type OutputSet = {
    outputScreen: HTMLSpanElement | null,
    outputOperation: HTMLSpanElement | null,
    otputMemory: HTMLSpanElement | null
}
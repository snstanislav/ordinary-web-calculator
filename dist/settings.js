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
};
export const digitsRegex = /^\d{0,2}$/;
export const operationsRegex = /^[+\-*\/%]$/;
//# sourceMappingURL=settings.js.map
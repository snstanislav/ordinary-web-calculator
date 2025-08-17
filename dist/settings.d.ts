export declare const SETTINGS: {
    EMPTY: string;
    ZERO: string;
    DZERO: string;
    MEMORY: {
        M: string;
        MCLEAR: string;
        MREAD: string;
        MSAVE: string;
        MPLUS: string;
        MMINUS: string;
    };
    CONTROLS: {
        RESET: string;
        BACKSPACE: string;
        SQROOT: string;
        POWER2: string;
        NEGATE: string;
        FLPOINT: string;
        EQUALS: string;
        PLUS: string;
        MINUS: string;
        MULTIPLY: string;
        DIVIDE: string;
        MODULUS: string;
    };
};
export declare const digitsRegex: RegExp;
export declare const operationsRegex: RegExp;
export type SingleCalculation = {
    A: string;
    operation: string;
    B: string;
    equalsProc: boolean;
};
export type OutputSet = {
    outputScreen: HTMLSpanElement | null;
    outputOperation: HTMLSpanElement | null;
    otputMemory: HTMLSpanElement | null;
};
//# sourceMappingURL=settings.d.ts.map
// UI
let outputScreen = null;
let outputOperation = null;
let otputMemory = null;
// consts, types, utilities
const SETTINGS = {
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
const operationsRegex = /^[+\-*\/%]$/;
const digitsRegex = /^\d{0,2}$/;
// state vars
let memory = 0;
const calc = { A: SETTINGS.EMPTY, operation: SETTINGS.EMPTY, B: SETTINGS.EMPTY, equalsProc: false };
function getOutputScreenValue() {
    console.log(outputScreen === null || outputScreen === void 0 ? void 0 : outputScreen.innerText);
    return (outputScreen === null || outputScreen === void 0 ? void 0 : outputScreen.innerText) || SETTINGS.ZERO;
}
// 1 of 13 symbol places is reserved for "-" by negate operation
function setOutputScreenValue(value, isCalcResult) {
    if (outputScreen) {
        if (value.length < 13) {
            outputScreen.innerText = value;
        }
        else {
            if (isCalcResult) {
                if (value.includes(SETTINGS.CONTROLS.FLPOINT) && !value.includes("e")) {
                    if (value.indexOf(SETTINGS.CONTROLS.FLPOINT) < 12) {
                        outputScreen.innerText = value.slice(0, 12);
                    }
                    else {
                        outputScreen.innerText = Number.parseFloat(value).toExponential(2).toString();
                    }
                }
                else {
                    outputScreen.innerText = Number.parseFloat(value).toExponential(2).toString();
                }
            }
        }
    }
}
function setOutputOperationValue(value) {
    if (outputOperation) {
        value = value === SETTINGS.CONTROLS.MULTIPLY ? "\u00D7" :
            (value === SETTINGS.CONTROLS.DIVIDE ? "\u00F7" :
                (value === SETTINGS.CONTROLS.MINUS ? "\u2212" :
                    (value === SETTINGS.CONTROLS.SQROOT ? "\u221A" :
                        (value === SETTINGS.CONTROLS.POWER2 ? "x\u00B2" : value))));
        outputOperation.innerText = value;
    }
}
function setOutputMemoryValue(value) {
    if (otputMemory) {
        otputMemory.innerText = value || SETTINGS.EMPTY;
    }
}
function appendInputValue(current, additional) {
    let res = current + additional;
    if (res.length < 13) {
        return res;
    }
    else {
        return current;
    }
}
function handleInput(event) {
    var _a;
    let currInput = (_a = event.target) === null || _a === void 0 ? void 0 : _a.dataset.info;
    if (currInput) {
        if (currInput.includes(SETTINGS.MEMORY.M)) {
            setOutputMemoryValue(SETTINGS.MEMORY.M);
            switch (currInput) {
                case SETTINGS.MEMORY.MCLEAR:
                    memory = 0;
                    setOutputMemoryValue(SETTINGS.EMPTY);
                    break;
                case SETTINGS.MEMORY.MREAD:
                    debugger;
                    if (memory === 0)
                        setOutputMemoryValue(SETTINGS.EMPTY);
                    setOutputScreenValue(memory.toString(), false);
                    break;
                case SETTINGS.MEMORY.MSAVE:
                    memory = Number.parseFloat(getOutputScreenValue());
                    break;
                case SETTINGS.MEMORY.MPLUS:
                    memory += Number.parseFloat(getOutputScreenValue());
                    break;
                case SETTINGS.MEMORY.MMINUS:
                    memory -= Number.parseFloat(getOutputScreenValue());
                    break;
                default:
                    memory = 0;
                    break;
            }
        }
        else if (digitsRegex.test(currInput)) { // DIGITS -- USER INPUT
            if (calc.equalsProc === true)
                clearCalcStack();
            if (calc.operation === SETTINGS.EMPTY) {
                if (calc.A === SETTINGS.EMPTY || calc.A === SETTINGS.ZERO) {
                    if (currInput !== SETTINGS.DZERO) {
                        calc.A = currInput;
                        setOutputScreenValue(calc.A, false);
                    }
                }
                else {
                    calc.A = appendInputValue(calc.A, currInput);
                    setOutputScreenValue(calc.A, false);
                }
            }
            else if (calc.operation !== SETTINGS.EMPTY && (calc.B === SETTINGS.EMPTY || calc.B === SETTINGS.ZERO)) {
                if (currInput !== SETTINGS.DZERO) {
                    calc.B = currInput;
                    setOutputScreenValue(calc.B, false);
                }
            }
            else if (calc.operation !== SETTINGS.EMPTY && calc.B !== SETTINGS.EMPTY) {
                calc.B = appendInputValue(calc.B, currInput);
                setOutputScreenValue(calc.B, false);
            }
        }
        else if (currInput === SETTINGS.CONTROLS.FLPOINT) { // F.POINT -- USER INPUT
            if (calc.equalsProc === true)
                calc.B = SETTINGS.EMPTY;
            if (calc.A === SETTINGS.EMPTY) {
                calc.A = SETTINGS.ZERO + SETTINGS.CONTROLS.FLPOINT;
                setOutputScreenValue(calc.A, false);
            }
            else if (!calc.A.includes(currInput) && calc.B === SETTINGS.EMPTY) {
                calc.A = appendInputValue(calc.A, currInput);
                setOutputScreenValue(calc.A, false);
            }
            else if (calc.B !== SETTINGS.EMPTY && !calc.B.includes(currInput)) {
                calc.B = appendInputValue(calc.B, currInput);
                setOutputScreenValue(calc.B, false);
            }
        }
        else if (operationsRegex.test(currInput)) { // OPERATIONS
            if (calc.equalsProc === true) {
                calc.B = SETTINGS.EMPTY;
                calc.equalsProc = false;
            }
            if (calc.A === SETTINGS.EMPTY) {
                calc.A = SETTINGS.ZERO;
            }
            if (calc.A !== SETTINGS.EMPTY && calc.B === SETTINGS.EMPTY) {
                calc.operation = currInput;
                setOutputOperationValue(currInput);
            }
            else {
                performCalc();
                calc.B = SETTINGS.EMPTY;
                calc.operation = currInput;
                setOutputOperationValue(currInput);
            }
        }
        else if (currInput === SETTINGS.CONTROLS.EQUALS) { // EQUALS
            if (calc.B !== SETTINGS.EMPTY) {
                setOutputOperationValue(SETTINGS.EMPTY);
                calc.equalsProc = true;
                performCalc();
            }
            else if (calc.A !== SETTINGS.EMPTY && (calc.operation === SETTINGS.CONTROLS.SQROOT || calc.operation === SETTINGS.CONTROLS.POWER2)) {
                setOutputOperationValue(SETTINGS.EMPTY);
                calc.equalsProc = true;
                performCalc();
            }
        }
        else if (currInput === SETTINGS.CONTROLS.POWER2) { // POWER
            if (calc.A !== SETTINGS.EMPTY && (calc.B === SETTINGS.EMPTY || calc.equalsProc === true)) {
                setOutputOperationValue(currInput);
                calc.operation = currInput;
                performCalc();
            }
        }
        else if (currInput === SETTINGS.CONTROLS.SQROOT) { // SQUARE ROOT
            if (calc.A !== SETTINGS.EMPTY && (calc.B === SETTINGS.EMPTY || calc.equalsProc === true)) {
                setOutputOperationValue(currInput);
                calc.operation = currInput;
                performCalc();
            }
        }
        else if (currInput === SETTINGS.CONTROLS.NEGATE) { // NEGATE
            if (calc.A !== SETTINGS.EMPTY && (calc.B === SETTINGS.EMPTY || calc.equalsProc === true)) {
                calc.A = (-Number.parseFloat(calc.A)).toString();
                setOutputScreenValue(calc.A, false);
            }
            if (calc.B !== SETTINGS.EMPTY && calc.equalsProc === false) {
                calc.B = (-Number.parseFloat(calc.B)).toString();
                setOutputScreenValue(calc.B, false);
            }
        }
        else if (currInput === SETTINGS.CONTROLS.BACKSPACE) { // BACKSPACE
            if (calc.A !== SETTINGS.EMPTY && calc.operation === SETTINGS.EMPTY) {
                if (calc.A.length <= 1) {
                    calc.A = SETTINGS.ZERO;
                }
                else {
                    calc.A = calc.A.slice(0, calc.A.length - 1);
                }
                setOutputScreenValue(calc.A, false);
            }
            else if (calc.B !== SETTINGS.EMPTY && calc.equalsProc === false) {
                if (calc.B.length <= 1) {
                    calc.B = SETTINGS.ZERO;
                }
                else {
                    calc.B = calc.B.slice(0, calc.B.length - 1);
                }
                setOutputScreenValue(calc.B, false);
            }
        }
        else if (currInput === SETTINGS.CONTROLS.RESET) { // RESET
            setOutputScreenValue(SETTINGS.EMPTY, false);
            clearCalcStack();
        }
    }
    console.log(`Memory: ${memory}\t screen: ${getOutputScreenValue()} \n[${calc.A}, ${calc.operation}, ${calc.B}, ${calc.equalsProc}]`);
}
function performCalc() {
    switch (calc.operation) {
        case SETTINGS.CONTROLS.PLUS:
            calc.A = (Number.parseFloat(calc.A) + Number.parseFloat(calc.B)).toString();
            break;
        case SETTINGS.CONTROLS.MINUS:
            calc.A = (Number.parseFloat(calc.A) - Number.parseFloat(calc.B)).toString();
            break;
        case SETTINGS.CONTROLS.MULTIPLY:
            calc.A = (Number.parseFloat(calc.A) * Number.parseFloat(calc.B)).toString();
            break;
        case SETTINGS.CONTROLS.DIVIDE:
            calc.A = (Number.parseFloat(calc.A) / Number.parseFloat(calc.B)).toString();
            break;
        case SETTINGS.CONTROLS.MODULUS:
            calc.A = (Number.parseFloat(calc.A) % Number.parseFloat(calc.B)).toString();
            break;
        case SETTINGS.CONTROLS.POWER2:
            calc.A = (Number.parseFloat(calc.A) * Number.parseFloat(calc.A)).toString();
            break;
        case SETTINGS.CONTROLS.SQROOT:
            calc.A = Math.sqrt(Number.parseFloat(calc.A)).toString();
            break;
        default:
            throw Error(`Operation <${calc.operation}> is not valid`);
    }
    setOutputScreenValue(calc.A, true);
}
function clearCalcStack() {
    calc.A = SETTINGS.EMPTY;
    calc.operation = SETTINGS.EMPTY;
    calc.B = SETTINGS.EMPTY;
    calc.equalsProc = false;
    setOutputScreenValue(SETTINGS.ZERO, false);
    setOutputOperationValue(SETTINGS.EMPTY);
}
document.addEventListener("DOMContentLoaded", () => {
    outputScreen = document.getElementById("output-screen");
    outputOperation = document.getElementById("output-operation");
    otputMemory = document.getElementById("output-memory");
    if (!outputScreen || !outputOperation || !setOutputMemoryValue) {
        console.error("Output element not found!");
        return;
    }
    const buttonsCollection = document.querySelectorAll(".btn-key");
    for (let elem of buttonsCollection) {
        elem.addEventListener("click", handleInput);
    }
    /*
    handleInput("9")
    handleInput("0")
    handleInput(".")
    handleInput(".")
    handleInput("4")
    handleInput("0")
    handleInput(".")
    handleInput("=")
    handleInput(".")
    handleInput("0")
    handleInput("0")
    handleInput("0")
    handleInput("4")
    handleInput("4")
    handleInput("4")
    handleInput("/")
    handleInput("2")
    handleInput("+")
    handleInput(".")
    handleInput(".")
    handleInput("+")
    handleInput("*")
    handleInput("5")
    handleInput("+")
    handleInput("+")
    handleInput("2")
    handleInput("0")
    handleInput("7")
    handleInput("3")
    handleInput("6")
    handleInput("backsp")
    handleInput("backsp")
    handleInput("6")
    handleInput("3")
    handleInput("4")
    handleInput("+")
    console.log(calc)
    handleInput("negate")
    handleInput("-")
    handleInput("1")
    handleInput("0")
    handleInput("0")
    handleInput("=")
    handleInput("8")
    handleInput("7")
    handleInput("6")
    console.log(calc)
    handleInput("backsp")
    handleInput("backsp")
    handleInput("backsp")
    console.log(calc)
    console.log(calc)
    handleInput("backsp")
    handleInput("backsp")
    console.log(calc)
    handleInput("5")
    console.log(calc)
    console.log(calc)
    handleInput("7")
    console.log(calc)
    handleInput("4")
    console.log(calc)
    handleInput("backsp")
    handleInput("backsp")
    handleInput("=")
    handleInput("4")
    handleInput("4")
    */
});
export {};
//# sourceMappingURL=index.js.map
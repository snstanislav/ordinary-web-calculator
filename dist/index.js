document.addEventListener("DOMContentLoaded", () => {
    const currentScreen = document.getElementById("output-screen");
    const operationScreen = document.getElementById("output-operation");
    if (!currentScreen || !operationScreen) {
        console.error("Output element not found!");
        return;
    }
    const buttonsCollection = document.querySelectorAll(".btn-key");
    for (let elem of buttonsCollection) {
        elem.addEventListener("click", handleInput);
    }
    function setScreenValue(value) {
        if (currentScreen) {
            if (value.length <= 13) {
                currentScreen.innerText = value;
            }
            else {
                currentScreen.innerText = Number.parseFloat(value).toExponential(2).toString();
            }
        }
    }
    function setScreenOperation(value) {
        if (operationScreen) {
            operationScreen.innerText = value;
        }
    }
    function appendInputValue(current, additional) {
        let res = current + additional;
        if (res.length <= 13) {
            return res;
        }
        else {
            return current;
        }
    }
    const SETTINGS = {
        EMPTY: "",
        MEMORY: {
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
    const calc = { A: SETTINGS.EMPTY, operation: SETTINGS.EMPTY, B: SETTINGS.EMPTY, equalsProc: false };
    let result = "0";
    function handleInput(event) {
        var _a;
        let currInput = (_a = event.target) === null || _a === void 0 ? void 0 : _a.dataset.info;
        if (currInput)
            // DIGITS
            if (digitsRegex.test(currInput)) {
                if (calc.equalsProc === true)
                    clearCalcStack();
                if (calc.operation === SETTINGS.EMPTY) {
                    if (calc.A === SETTINGS.EMPTY || calc.A === "0") {
                        if (currInput !== "00") {
                            calc.A = currInput;
                            result = calc.A;
                        }
                    }
                    else {
                        calc.A = appendInputValue(calc.A, currInput);
                        result = calc.A;
                    }
                }
                else if (calc.operation !== SETTINGS.EMPTY && (calc.B === SETTINGS.EMPTY || calc.B === "0")) {
                    if (currInput !== "00") {
                        calc.B = currInput;
                        result = calc.B;
                    }
                }
                else if (calc.operation !== SETTINGS.EMPTY && calc.B !== SETTINGS.EMPTY) {
                    calc.B = appendInputValue(calc.B, currInput);
                    result = calc.B;
                }
                // FLOATINGS
            }
            else if (currInput === SETTINGS.CONTROLS.FLPOINT) {
                if (calc.equalsProc === true)
                    calc.B = SETTINGS.EMPTY;
                if (calc.A === SETTINGS.EMPTY) {
                    calc.A = "0" + SETTINGS.CONTROLS.FLPOINT;
                    result = calc.A;
                }
                else if (!calc.A.includes(currInput) && calc.B === SETTINGS.EMPTY) {
                    calc.A = appendInputValue(calc.A, currInput);
                    result = calc.A;
                }
                else if (calc.B !== SETTINGS.EMPTY && !calc.B.includes(currInput)) {
                    calc.B = appendInputValue(calc.B, currInput);
                    result = calc.B;
                }
                // OPERATIONS
            }
            else if (operationsRegex.test(currInput)) {
                if (calc.equalsProc === true) {
                    calc.B = SETTINGS.EMPTY;
                    calc.equalsProc = false;
                }
                if (calc.A === SETTINGS.EMPTY) {
                    calc.A = "0";
                }
                if (calc.A !== SETTINGS.EMPTY && calc.B === SETTINGS.EMPTY) {
                    calc.operation = currInput;
                    setScreenOperation(currInput);
                }
                else {
                    performCalc();
                    calc.B = SETTINGS.EMPTY;
                    calc.operation = currInput;
                    setScreenOperation(currInput);
                }
                // EQUALS
            }
            else if (currInput === SETTINGS.CONTROLS.EQUALS) {
                setScreenOperation("");
                if (calc.B !== SETTINGS.EMPTY) {
                    calc.equalsProc = true;
                    performCalc();
                }
                else if (calc.A !== SETTINGS.EMPTY && (calc.operation === SETTINGS.CONTROLS.SQROOT || calc.operation === SETTINGS.CONTROLS.POWER2)) {
                    calc.equalsProc = true;
                    performCalc();
                }
                // POWER
            }
            else if (currInput === SETTINGS.CONTROLS.POWER2) {
                if (calc.A !== SETTINGS.EMPTY && (calc.B === SETTINGS.EMPTY || calc.equalsProc === true)) {
                    calc.operation = currInput;
                    performCalc();
                }
                // SQUARE ROOT
            }
            else if (currInput === SETTINGS.CONTROLS.SQROOT) {
                if (calc.A !== SETTINGS.EMPTY && (calc.B === SETTINGS.EMPTY || calc.equalsProc === true)) {
                    calc.operation = currInput;
                    performCalc();
                } // NEGATE
            }
            else if (currInput === SETTINGS.CONTROLS.NEGATE) {
                if (calc.A !== SETTINGS.EMPTY && (calc.B === SETTINGS.EMPTY || calc.equalsProc === true)) {
                    calc.A = (-Number.parseFloat(calc.A)).toString();
                    result = calc.A;
                }
                if (calc.B !== SETTINGS.EMPTY && calc.equalsProc === false) {
                    calc.B = (-Number.parseFloat(calc.B)).toString();
                    result = calc.B;
                } // BACKSPACE
            }
            else if (currInput === SETTINGS.CONTROLS.BACKSPACE) {
                if (calc.A !== SETTINGS.EMPTY && calc.operation === SETTINGS.EMPTY) {
                    if (calc.A.length <= 1) {
                        calc.A = "0";
                    }
                    else {
                        calc.A = calc.A.slice(0, calc.A.length - 1);
                    }
                    result = calc.A;
                }
                else if (calc.B !== SETTINGS.EMPTY && calc.equalsProc === false) {
                    if (calc.B.length <= 1) {
                        calc.B = "0";
                    }
                    else {
                        calc.B = calc.B.slice(0, calc.B.length - 1);
                    }
                    result = calc.B;
                }
                // RESET
            }
            else if (currInput === SETTINGS.CONTROLS.RESET) {
                result = SETTINGS.EMPTY;
                clearCalcStack();
            }
        console.log(`result = ${result} \t [${calc.A}, ${calc.operation}, ${calc.B}, ${calc.equalsProc}]`);
        setScreenValue(result || "0");
        //  calc.operation == "" ? setScreenOperation("") : setScreenOperation(calc.operation);
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
                calc.A = Math.pow(Number.parseFloat(calc.A), 2).toString();
                break;
            case SETTINGS.CONTROLS.SQROOT:
                calc.A = Math.sqrt(Number.parseFloat(calc.A)).toString();
                break;
            default:
                throw Error(`Operation <${calc.operation}> is not valid`);
        }
        result = calc.A;
    }
    function clearCalcStack() {
        calc.A = SETTINGS.EMPTY;
        calc.operation = SETTINGS.EMPTY;
        calc.B = SETTINGS.EMPTY;
        calc.equalsProc = false;
        setScreenValue("0");
        setScreenOperation("");
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
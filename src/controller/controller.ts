import { SETTINGS, digitsRegex, operationsRegex, type SingleCalculation, type OutputSet } from "../settings.js";
import { performCalc } from "../model/calculation.js";

export function getController(output: OutputSet) {
    // UI access
    let outputScreen = output.outputScreen;
    let outputOperation = output.outputOperation;
    let otputMemory = output.otputMemory;

    // state vars
    let memory: number = 0;
    const calc: SingleCalculation = { A: SETTINGS.EMPTY, operation: SETTINGS.EMPTY, B: SETTINGS.EMPTY, equalsProc: false }

    function getOutputScreenValue(): string {
        console.log(outputScreen?.innerText)
        return outputScreen?.innerText || SETTINGS.ZERO;
    }

    // 1 of 13 symbol places is reserved for "-" by negate operation
    function setOutputScreenValue(value: string, isCalcResult: boolean) {
        if (outputScreen) {
            if (value.length < 13) {
                outputScreen.innerText = value;
            } else {
                if (isCalcResult) {
                    if (value.includes(SETTINGS.CONTROLS.FLPOINT) && !value.includes("e")) {
                        if (value.indexOf(SETTINGS.CONTROLS.FLPOINT) < 12) {
                            outputScreen.innerText = value.slice(0, 12);
                        } else {
                            outputScreen.innerText = Number.parseFloat(value).toExponential(2).toString();
                        }
                    } else {
                        outputScreen.innerText = Number.parseFloat(value).toExponential(2).toString();
                    }
                }
            }
        }
    }

    function setOutputOperationValue(value: string) {
        if (outputOperation) {
            value = value === SETTINGS.CONTROLS.MULTIPLY ? "\u00D7" :
                (value === SETTINGS.CONTROLS.DIVIDE ? "\u00F7" :
                    (value === SETTINGS.CONTROLS.MINUS ? "\u2212" :
                        (value === SETTINGS.CONTROLS.SQROOT ? "\u221A" :
                            (value === SETTINGS.CONTROLS.POWER2 ? "x\u00B2" : value))));
            outputOperation.innerText = value;
        }
    }

    function setOutputMemoryValue(value: string) {
        if (otputMemory) {
            otputMemory.innerText = value || SETTINGS.EMPTY;
        }
    }

    function appendInputValue(current: string, additional: string): string {
        let res = current + additional;
        if (res.length < 13) {
            return res;
        } else {
            return current;
        }
    }

    function clearCalcStack() {
        calc.A = SETTINGS.EMPTY;
        calc.operation = SETTINGS.EMPTY;
        calc.B = SETTINGS.EMPTY;
        calc.equalsProc = false;
        setOutputScreenValue(SETTINGS.ZERO, false);
        setOutputOperationValue(SETTINGS.EMPTY);
    }

    return function handleInput(event: MouseEvent) {
        let currInput = (event.target as HTMLButtonElement | null)?.dataset.info;
        if (currInput) {
            if (currInput.includes(SETTINGS.MEMORY.M)) {
                handleMemory(currInput);
            } else if (digitsRegex.test(currInput)) { // DIGITS
                handleDigits(currInput);
            } else if (operationsRegex.test(currInput)) { // OPERATIONS
                handleOperations(currInput);
            } else if (currInput === SETTINGS.CONTROLS.FLPOINT) {
                handleFlPoint();
            } else if (currInput === SETTINGS.CONTROLS.EQUALS) {
                handleEquals();
            } else if (currInput === SETTINGS.CONTROLS.POWER2) {
                handlePower2();
            } else if (currInput === SETTINGS.CONTROLS.SQROOT) {
                handleSqrt();
            } else if (currInput === SETTINGS.CONTROLS.NEGATE) {
                handleNegate();
            } else if (currInput === SETTINGS.CONTROLS.BACKSPACE) {
                handleBackspace();
            } else if (currInput === SETTINGS.CONTROLS.RESET) {
                handleReset();
            }
        }

        console.log(`Memory: ${memory}\t screen: ${getOutputScreenValue()} \n[${calc.A}, ${calc.operation}, ${calc.B}, ${calc.equalsProc}]`)
    }

    function handleMemory(currInput: string) {
        setOutputMemoryValue(SETTINGS.MEMORY.M);
        setOutputOperationValue(SETTINGS.EMPTY);
        switch (currInput) {
            case SETTINGS.MEMORY.MCLEAR:
                memory = 0;
                setOutputMemoryValue(SETTINGS.EMPTY);
                break;
            case SETTINGS.MEMORY.MREAD:
                debugger;
                if (memory === 0) setOutputMemoryValue(SETTINGS.EMPTY);
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

    function handleDigits(currInput: string) {
        if (calc.equalsProc === true) clearCalcStack();
        if (calc.operation === SETTINGS.EMPTY) {
            if (calc.A === SETTINGS.EMPTY || calc.A === SETTINGS.ZERO) {
                if (currInput !== SETTINGS.DZERO) {
                    calc.A = currInput
                    setOutputScreenValue(calc.A, false);
                }
            } else {
                calc.A = appendInputValue(calc.A, currInput)
                setOutputScreenValue(calc.A, false);
            }
        }
        else if (calc.operation !== SETTINGS.EMPTY
            && (calc.B === SETTINGS.EMPTY || calc.B === SETTINGS.ZERO)) {
            if (currInput !== SETTINGS.DZERO) {
                calc.B = currInput;
                setOutputScreenValue(calc.B, false);
            }
        } else if (calc.operation !== SETTINGS.EMPTY && calc.B !== SETTINGS.EMPTY) {
            calc.B = appendInputValue(calc.B, currInput)
            setOutputScreenValue(calc.B, false);
        }
    }

    function handleOperations(currInput: string) {
        if (calc.equalsProc === true) {
            calc.B = SETTINGS.EMPTY;
            calc.equalsProc = false;
        }
        if (calc.A === SETTINGS.EMPTY) {
            calc.A = SETTINGS.ZERO;
        }
        if (calc.A !== SETTINGS.EMPTY && calc.B === SETTINGS.EMPTY) {
            calc.operation = currInput
            setOutputOperationValue(currInput);
        } else {
            performCalc(calc);

            setOutputScreenValue(calc.A, true);

            calc.B = SETTINGS.EMPTY;
            calc.operation = currInput;
            setOutputOperationValue(currInput);
        }
    }

    function handleFlPoint() {
        if (calc.equalsProc === true) calc.B = SETTINGS.EMPTY;
        if (calc.A === SETTINGS.EMPTY) {
            calc.A = SETTINGS.ZERO + SETTINGS.CONTROLS.FLPOINT;
            setOutputScreenValue(calc.A, false);
        } else if (!calc.A.includes(SETTINGS.CONTROLS.FLPOINT) 
            && calc.B === SETTINGS.EMPTY) {
            calc.A = appendInputValue(calc.A, SETTINGS.CONTROLS.FLPOINT);
            setOutputScreenValue(calc.A, false);
        } else if (calc.B !== SETTINGS.EMPTY && !calc.B.includes(SETTINGS.CONTROLS.FLPOINT)) {
            calc.B = appendInputValue(calc.B, SETTINGS.CONTROLS.FLPOINT);
            setOutputScreenValue(calc.B, false);
        }
    }

    function handleEquals() {
        if (calc.B !== SETTINGS.EMPTY) {
            setOutputOperationValue(SETTINGS.EMPTY);
            calc.equalsProc = true;
            performCalc(calc);

            setOutputScreenValue(calc.A, true);
        } else if (calc.A !== SETTINGS.EMPTY && (calc.operation === SETTINGS.CONTROLS.SQROOT || calc.operation === SETTINGS.CONTROLS.POWER2)) {
            setOutputOperationValue(SETTINGS.EMPTY);
            calc.equalsProc = true;
            performCalc(calc);

            setOutputScreenValue(calc.A, true);
        }
    }

    function handlePower2() {
        if (calc.A !== SETTINGS.EMPTY && (calc.B === SETTINGS.EMPTY || calc.equalsProc === true)) {
            setOutputOperationValue(SETTINGS.CONTROLS.POWER2)
            calc.operation = SETTINGS.CONTROLS.POWER2;
            performCalc(calc);

            setOutputScreenValue(calc.A, true);
        }
    }

    function handleSqrt() {
        if (calc.A !== SETTINGS.EMPTY && (calc.B === SETTINGS.EMPTY || calc.equalsProc === true)) {
            setOutputOperationValue(SETTINGS.CONTROLS.SQROOT)
            calc.operation = SETTINGS.CONTROLS.SQROOT;
            performCalc(calc);

            setOutputScreenValue(calc.A, true);
        }
    }

    function handleNegate() {
        if (calc.A !== SETTINGS.EMPTY && (calc.B === SETTINGS.EMPTY || calc.equalsProc === true)) {
            calc.A = (-Number.parseFloat(calc.A)).toString();
            setOutputScreenValue(calc.A, false);
        } if (calc.B !== SETTINGS.EMPTY && calc.equalsProc === false) {
            calc.B = (-Number.parseFloat(calc.B)).toString();
            setOutputScreenValue(calc.B, false);
        }
    }

    function handleBackspace() {
        if (calc.A !== SETTINGS.EMPTY && calc.operation === SETTINGS.EMPTY) {
            if (calc.A.length <= 1) {
                calc.A = SETTINGS.ZERO;
            } else {
                calc.A = calc.A.slice(0, calc.A.length - 1);
            }
            setOutputScreenValue(calc.A, false);
        } else if (calc.B !== SETTINGS.EMPTY && calc.equalsProc === false) {
            if (calc.B.length <= 1) {
                calc.B = SETTINGS.ZERO;
            } else {
                calc.B = calc.B.slice(0, calc.B.length - 1);
            }
            setOutputScreenValue(calc.B, false);
        }
    }

    function handleReset() {
        setOutputScreenValue(SETTINGS.EMPTY, false);
        clearCalcStack();
    }
}
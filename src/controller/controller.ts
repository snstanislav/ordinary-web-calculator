/**
 * @file controller.ts
 * @description UI controller module for managing calculator input, state transitions, and display updates. 
 * Handles user interactions, memory operations, and delegates arithmetic logic to the calculation model.
 * @author Stanislav Snisar
 * @version 1.1.0
 * @created 08.2025
 * @module controller/controller
 */

import { SETTINGS, digitsRegex, operationsRegex, type SingleCalculation, type OutputSet } from "../settings.js";
import { performCalc } from "../model/calculation.js";

/**
 * Initializes and returns the input handler for calculator UI interactions.
 *
 * @param {OutputSet} output - References to UI output elements.
 * @returns {(event: MouseEvent) => void} Event handler for button clicks.
 */
export function getController(output: OutputSet) {
    // UI access
    let outputScreen = output.outputScreen;
    let outputOperation = output.outputOperation;
    let otputMemory = output.otputMemory;

    /**
    * State variable. 
    * Stores the current memory value used in memory operations (M+, M-, MR, etc.).
    * @type {number}
    */
    let memory: number = 0;

    /**
    * State variable. 
    * Tracks the current calculation state, including operands, selected operation, and whether the result has already been computed.
    */
    const calc: SingleCalculation = { A: SETTINGS.EMPTY, operation: SETTINGS.EMPTY, B: SETTINGS.EMPTY, equalsProc: false }

    /**
    * Returns the current value displayed on the calculator screen.
    * @returns {string}
    */
    function getOutputScreenValue(): string {
        console.log(outputScreen?.innerText)
        return outputScreen?.innerText || SETTINGS.ZERO;
    }

    /**
    * Updates the calculator screen with a new value.
    * 
    * 1 of 13 symbol places is reserved for "-" by negate operation
    * 
    * @param {string} value - Value to display.
    * @param {boolean} isCalcResult - Whether the value is a calculation result.
    */
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

    /**
    * Updates the operation display with a formatted symbol.
    * @param {string} value - Operation identifier.
    */
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

    /**
    * Updates the memory indicator display.
    * @param {string} value - Memory label or empty string.
    */
    function setOutputMemoryValue(value: string) {
        if (otputMemory) {
            otputMemory.innerText = value || SETTINGS.EMPTY;
        }
    }

    /**
    * Appends a digit or symbol to the current input value.
    * @param {string} current - Existing input.
    * @param {string} additional - New character to append.
    * @returns {string}
    */
    function appendInputValue(current: string, additional: string): string {
        let res = current + additional;
        if (res.length < 13) {
            return res;
        } else {
            return current;
        }
    }

    /**
    * Clears the current calculation state and resets the display.
    */
    function clearCalcStack() {
        calc.A = SETTINGS.EMPTY;
        calc.operation = SETTINGS.EMPTY;
        calc.B = SETTINGS.EMPTY;
        calc.equalsProc = false;
        setOutputScreenValue(SETTINGS.ZERO, false);
        setOutputOperationValue(SETTINGS.EMPTY);
    }

    /**
    * Handles calculator button input events and dispatches them to the appropriate logic handler.
    *
    * Determines the type of input (digit, operation, memory control, etc.) based on the button's `data-info` attribute,
    * and routes it to the corresponding handler function.
    *
    * @param {MouseEvent} event - The click event triggered by a calculator button.
    */
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

    /**
    * Handles memory-related button inputs (MC, MR, M+, M-, MS).
    * @param {string} currInput - Memory control identifier.
    */
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

    /**
    * Handles digit button inputs and updates operands.
    * @param {string} currInput - Digit character.
    */
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

    /**
    * Handles arithmetic operation inputs and triggers calculation if needed.
    * @param {string} currInput - Operation identifier.
    */
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

    /**
    * Handles floating point input (".") for A or B.
    */
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

    /**
    * Executes the calculation when "=" is pressed.
    */
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

    /**
    * Performs squaring operation on A.
    */
    function handlePower2() {
        if (calc.A !== SETTINGS.EMPTY && (calc.B === SETTINGS.EMPTY || calc.equalsProc === true)) {
            setOutputOperationValue(SETTINGS.CONTROLS.POWER2)
            calc.operation = SETTINGS.CONTROLS.POWER2;
            performCalc(calc);

            setOutputScreenValue(calc.A, true);
        }
    }

    /**
    * Performs square root operation on A.
    */
    function handleSqrt() {
        if (calc.A !== SETTINGS.EMPTY && (calc.B === SETTINGS.EMPTY || calc.equalsProc === true)) {
            setOutputOperationValue(SETTINGS.CONTROLS.SQROOT)
            calc.operation = SETTINGS.CONTROLS.SQROOT;
            performCalc(calc);

            setOutputScreenValue(calc.A, true);
        }
    }

    /**
    * Negates the current operand (A or B).
    */
    function handleNegate() {
        if (calc.A !== SETTINGS.EMPTY && (calc.B === SETTINGS.EMPTY || calc.equalsProc === true)) {
            calc.A = (-Number.parseFloat(calc.A)).toString();
            setOutputScreenValue(calc.A, false);
        } if (calc.B !== SETTINGS.EMPTY && calc.equalsProc === false) {
            calc.B = (-Number.parseFloat(calc.B)).toString();
            setOutputScreenValue(calc.B, false);
        }
    }

    /**
    * Removes the last character from A or B.
    */
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

    /**
    * Resets the calculator state and clears the display.
    */
    function handleReset() {
        setOutputScreenValue(SETTINGS.EMPTY, false);
        clearCalcStack();
    }
}
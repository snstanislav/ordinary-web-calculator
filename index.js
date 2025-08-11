"strict mode";

document.addEventListener("DOMContentLoaded", () => {
    const screen = document.getElementById("calcScreen");
    if (!screen) {
        console.error("screen element not found!");
        return;
    }

    const buttonsCollection = document.querySelectorAll(".buttonsRow > div");
    for (let elem of buttonsCollection) {
        elem.addEventListener("click", handleInput);
    }

    function setScreenValue(value) {
        screen.innerText = value;
    }

    const SETTINGS = {
        EMPTY: "",
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

    const operationsRegex = /^[+\-*\/%]$/
    const digitsRegex = /^\d$/
    const calc = { A: SETTINGS.EMPTY, operation: SETTINGS.EMPTY, B: SETTINGS.EMPTY, equalOn: false }
    let result = 0

    function handleInput(event) {
        let currInput = event.target.dataset.info;

        if (currInput)

            // DIGITS
            if (digitsRegex.test(currInput)) {
                if (calc.equalOn === true) clearCalcStack();
                if (calc.operation === SETTINGS.EMPTY) {
                    if (calc.A === SETTINGS.EMPTY || calc.A === "0") {
                        calc.A = currInput
                        result = calc.A
                    } else {
                        calc.A += currInput
                        result = calc.A
                    }
                }
                else if (calc.operation !== SETTINGS.EMPTY && (calc.B === SETTINGS.EMPTY || calc.B === "0")) {
                    calc.B = currInput
                    result = calc.B
                } else if (calc.operation !== SETTINGS.EMPTY && calc.B !== SETTINGS.EMPTY) {
                    calc.B += currInput
                    result = calc.B
                }
                // FLOATINGS
            } else if (currInput === SETTINGS.CONTROLS.FLPOINT) {
                if (calc.equalOn === true) calc.B = SETTINGS.EMPTY;

                if (calc.A === SETTINGS.EMPTY) {
                    calc.A = "0" + SETTINGS.CONTROLS.FLPOINT
                    result = calc.A
                } else if (!calc.A.toString().includes(currInput) && calc.B === SETTINGS.EMPTY) {
                    calc.A += currInput
                    result = calc.A
                } else if (calc.B !== SETTINGS.EMPTY && !calc.B.toString().includes(currInput)) {
                    calc.B += currInput
                    result = calc.B
                }
                // OPERATIONS
            } else if (operationsRegex.test(currInput)) {
                if (calc.equalOn === true) calc.B = SETTINGS.EMPTY;

                if (calc.A !== SETTINGS.EMPTY && calc.B === SETTINGS.EMPTY) {
                    calc.operation = currInput
                } else {
                    performCalc()
                    calc.B = SETTINGS.EMPTY
                    calc.operation = currInput
                }
                // EQUALS
            } else if (currInput === SETTINGS.CONTROLS.EQUALS) {
                if (calc.B !== SETTINGS.EMPTY) {
                    calc.equalOn = true
                    performCalc();
                } else if (calc.A !== SETTINGS.EMPTY && (calc.operation === SETTINGS.CONTROLS.SQROOT || calc.operation === SETTINGS.CONTROLS.POWER2)) {
                    calc.equalOn = true
                    performCalc();
                }
                // POWER
            } else if (currInput === SETTINGS.CONTROLS.POWER2) {
                if (calc.A !== SETTINGS.EMPTY && calc.B === SETTINGS.EMPTY) {
                    calc.operation = currInput
                    performCalc();
                }
                // SQUARE ROOT
            } else if (currInput === SETTINGS.CONTROLS.SQROOT) {
                if (calc.A !== SETTINGS.EMPTY && calc.B === SETTINGS.EMPTY) {
                    calc.operation = currInput
                    performCalc();
                } // NEGATE
            } else if (currInput === SETTINGS.CONTROLS.NEGATE) {
                if (calc.A !== SETTINGS.EMPTY && (calc.B === SETTINGS.EMPTY || calc.equalOn === true)) {
                    calc.A = (-Number.parseFloat(calc.A)).toString()
                    result = calc.A
                } if (calc.B !== SETTINGS.EMPTY && calc.equalOn === false) {
                    calc.B = (-Number.parseFloat(calc.B).toString())
                    result = calc.B
                } // BACKSPACE
            } else if (currInput === SETTINGS.CONTROLS.BACKSPACE) {
                if (calc.A !== SETTINGS.EMPTY && calc.operation === SETTINGS.EMPTY) {
                    if (calc.A.toString().length <= 1) {
                        calc.A = "0"
                    } else {
                        calc.A = calc.A.toString().slice(0, calc.A.length - 1)
                    }
                    result = calc.A
                } else if (calc.B !== SETTINGS.EMPTY && calc.equalOn === false) {
                    if (calc.B.toString().length <= 1) {
                        calc.B = "0"
                    } else {
                        calc.B = calc.B.toString().slice(0, calc.B.length - 1)
                    }
                    result = calc.B
                }
                // RESET
            } else if (currInput === SETTINGS.CONTROLS.RESET) {
                result = SETTINGS.EMPTY
                clearCalcStack()
            }

        console.log(`result = ${result} \t ${calc.A} ${calc.operation} ${calc.B}`)
        setScreenValue(result || "0")
    }

    function performCalc() {
        switch (calc.operation) {
            case SETTINGS.CONTROLS.PLUS:
                calc.A = Number.parseFloat(calc.A) + Number.parseFloat(calc.B)
                break;
            case SETTINGS.CONTROLS.MINUS:
                calc.A = Number.parseFloat(calc.A) - Number.parseFloat(calc.B)
                break;
            case SETTINGS.CONTROLS.MULTIPLY:
                calc.A = Number.parseFloat(calc.A) * Number.parseFloat(calc.B)
                break;
            case SETTINGS.CONTROLS.DIVIDE:
                calc.A = Number.parseFloat(calc.A) / Number.parseFloat(calc.B)
                break;
            case SETTINGS.CONTROLS.MODULUS:
                calc.A = Number.parseFloat(calc.A) % Number.parseFloat(calc.B)
                break;
            case SETTINGS.CONTROLS.POWER2:
                calc.A = Math.pow(Number.parseFloat(calc.A), 2)
                break
            case SETTINGS.CONTROLS.SQROOT:
                calc.A = Math.sqrt(Number.parseFloat(calc.A))
                break
            default:
                throw Error(`Operation <${currInput}> is not valid`)
        }
        result = calc.A
    }

    function clearCalcStack() {
        calc.A = SETTINGS.EMPTY
        calc.operation = SETTINGS.EMPTY
        calc.B = SETTINGS.EMPTY
        calc.equalOn = false
        setScreenValue("0")
    }




    /*function snapshot(place) {
      stateDisplay.innerText = 
        "source --- " + place + 
        "\nonScreen -- " + getFromScreen() + "\nfirst bin. operand -- " +
        frstBinOperand + 
        "\nsecond bin. operand -- " + scndBinOperand +
        "\nbinary operation :: " + binaryOperation + "\n\ncurrCalcResult -- " + currCalcResult +
        "\nisFloatPointOn -- " + isFloatPointOn;
    
      console.log("source -- " + place + "\nonScreen -- " + getFromScreen() + "\nfirst bin. operand -- " +
        frstBinOperand + 
        "\nsecond bin. operand -- " + scndBinOperand +
        "\nbinary operation -- " + binaryOperation + "\n\ncurrCalcResult -- " + currCalcResult +
        "\nisFloatPointOn -- " + isFloatPointOn);
    }*/

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
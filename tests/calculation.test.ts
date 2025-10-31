import { SETTINGS, type SingleCalculation } from "../src/settings";
import { performCalc } from "../src/model/calculation";

test("test PLUS operation REGULAR performing", () => {
    let calc: SingleCalculation = { A: "56", operation: SETTINGS.CONTROLS.PLUS, B: "14", equalsProc: false }
    performCalc(calc);
    expect(calc.A).toBe("70");
});

test("test MINUS operation REGULAR performing", () => {
    let calc: SingleCalculation = { A: "56", operation: SETTINGS.CONTROLS.MINUS, B: "14", equalsProc: false }
    performCalc(calc);
    expect(calc.A).toBe("42");
});

test("test MULTIPLY operation REGULAR performing", () => {
    let calc: SingleCalculation = { A: "4", operation: SETTINGS.CONTROLS.MULTIPLY, B: "11", equalsProc: false }
    performCalc(calc);
    expect(calc.A).toBe("44");
});

test("test DIVIDE operation REGULAR performing", () => {
    let calc: SingleCalculation = { A: "125", operation: SETTINGS.CONTROLS.DIVIDE, B: "5", equalsProc: false }
    performCalc(calc);
    expect(calc.A).toBe("25");
});

test("test MODULUS operation REGULAR performing", () => {
    let calc: SingleCalculation = { A: "19", operation: SETTINGS.CONTROLS.MODULUS, B: "4", equalsProc: false }
    performCalc(calc);
    expect(calc.A).toBe("3");
});

test("test POWER2 operation 2nd OPERAND NON-EMPTY performing", () => {
    let calc: SingleCalculation = { A: "11", operation: SETTINGS.CONTROLS.POWER2, B: "546", equalsProc: false }
    performCalc(calc);
    expect(calc.A).toBe("121");
});

test("test POWER2 operation 2nd OPERAND EMPTY performing", () => {
    let calc: SingleCalculation = { A: "11", operation: SETTINGS.CONTROLS.POWER2, B: "", equalsProc: false }
    performCalc(calc);
    expect(calc.A).toBe("121");
});


test("test SQROOT operation 2nd OPERAND NON-EMPTY performing", () => {
    let calc: SingleCalculation = { A: "64", operation: SETTINGS.CONTROLS.SQROOT, B: "546", equalsProc: false }
    performCalc(calc);
    expect(calc.A).toBe("8");
});

test("test SQROOT operation 2nd OPERAND EMPTY performing", () => {
    let calc: SingleCalculation = { A: "64", operation: SETTINGS.CONTROLS.SQROOT, B: "", equalsProc: false }
    performCalc(calc);
    expect(calc.A).toBe("8");
});

test("test NON-VALID operation performing (switch-default)", () => {
    let calc: SingleCalculation = { A: "64", operation: "", B: "64", equalsProc: false }
    expect(() => performCalc(calc)).toThrow();
});


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

import { SETTINGS, type SingleCalculation } from "../settings.js";

export function performCalc(calc: SingleCalculation) {
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
}
/**
 * @file calculation.ts
 * @description Core arithmetic logic for executing single-step calculations based on user input and operation type.
 * @author Stanislav Snisar
 * @version 1.1.0
 * @created 08.2025
 * @module model/calculation
 */

import { SETTINGS, type SingleCalculation } from "../settings.js";

/**
 * Executes a single arithmetic operation and updates the result in `calc.A`.
 *
 * @param {SingleCalculation} calc - Calculation input with operands and operation type.
 * @throws {Error} If the operation type is unsupported.
 */
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
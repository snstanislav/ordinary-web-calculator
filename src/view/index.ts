import { type OutputSet } from "../settings.js";
import { getController } from "../controller/controller.js";

document.addEventListener("DOMContentLoaded", () => {
    const output: OutputSet = {
        outputScreen: document.getElementById("output-screen"),
        outputOperation: document.getElementById("output-operation"),
        otputMemory: document.getElementById("output-memory")
    }

    if (!output.outputScreen || !output.outputOperation || !output.otputMemory) {
        console.error("Output element not found!");
        return;
    } else {
        const handleInput = getController(output);
        
        const buttonsCollection = document.querySelectorAll(".btn-key");
        for (let elem of buttonsCollection) {
            (elem as HTMLButtonElement).addEventListener("click", handleInput);
        }
    }
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

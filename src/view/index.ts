/**
 * @file index.ts
 * @description Entry point for initializing calculator UI, binding event listeners, and displaying app version.
 * @author Stanislav Snisar
 * @version 1.1.0
 * @created 08.2025
 * @module view/index
 */

import { SETTINGS, type OutputSet } from "../settings.js";
import { getController } from "../controller/controller.js";

const appVersion = "v.2.0";

/**
 * Initializes calculator output elements, sets version label, and binds input handlers to UI buttons.
 */
document.addEventListener("DOMContentLoaded", () => {
    const output: OutputSet = {
        outputScreen: document.getElementById("output-screen"),
        outputOperation: document.getElementById("output-operation"),
        otputMemory: document.getElementById("output-memory")
    }

    const versionLabel = document.getElementById("version-label");
    if (versionLabel) {
        versionLabel.innerText = appVersion;
    }

    if (!output.outputScreen || !output.outputOperation || !output.otputMemory) {
        console.error("Output element not found!");
        return;
    } else {
        output.outputScreen.innerText = SETTINGS.ZERO;

        const handleInput = getController(output);

        const buttonsCollection = document.querySelectorAll(".btn-key");
        for (let elem of buttonsCollection) {
            (elem as HTMLButtonElement).addEventListener("click", handleInput);
        }
    }
});
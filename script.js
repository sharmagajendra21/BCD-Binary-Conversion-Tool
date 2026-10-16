
"use strict";

// =====================================
// 1. GET HTML ELEMENTS
// =====================================

const inputMode = document.getElementById("inputMode");
const numberInput = document.getElementById("numberInput");
const inputLabel = document.getElementById("inputLabel");
const inputHint = document.getElementById("inputHint");

const convertBtn = document.getElementById("convertBtn");
const clearBtn = document.getElementById("clearBtn");

const errorMessage = document.getElementById("errorMessage");
const resultSection = document.getElementById("resultSection");

const inputCardLabel = document.getElementById("inputCardLabel");
const inputBCDResult = document.getElementById("inputBCDResult");
const decimalResult = document.getElementById("decimalResult");
const decimalExplanation = document.getElementById("decimalExplanation");
const bcdResult = document.getElementById("bcdResult");
const binaryResult = document.getElementById("binaryResult");
const stepsList = document.getElementById("stepsList");


// =====================================
// 2. CHANGE INPUT MODE
// =====================================

inputMode.addEventListener("change", function () {
    clearResults();
    numberInput.value = "";

    if (inputMode.value === "bcd") {
        inputLabel.textContent = "Enter BCD Bits";
        numberInput.placeholder = "Example: 0010 0101";
        inputHint.textContent =
            "Use four bits for each decimal digit. Spaces are optional.";
    } else {
        inputLabel.textContent = "Enter Decimal Number";
        numberInput.placeholder = "Example: 25";
        inputHint.textContent =
            "Enter a non-negative whole number using digits 0–9.";
    }
});


// =====================================
// 3. BCD TO DECIMAL
// =====================================

function convertBCDToDecimal(input) {
    const bits = input.replace(/\s/g, "");

    if (!/^[01]+$/.test(bits)) {
        throw new Error("BCD input must contain only 0s and 1s.");
    }

    if (bits.length % 4 !== 0) {
        throw new Error(
            "The BCD input must contain complete groups of 4 bits."
        );
    }

    const groups = bits.match(/.{4}/g);
    const digits = [];
    const steps = [];

    steps.push("Remove spaces and divide the input into 4-bit groups.");

    for (const group of groups) {
        const digit = parseInt(group, 2);

        if (digit > 9) {
            throw new Error(
                `Invalid BCD group ${group}. Valid groups represent 0 to 9.`
            );
        }

        digits.push(String(digit));

        steps.push(
            `BCD group ${group} converts to decimal digit ${digit}.`
        );
    }

    const decimal = digits.join("").replace(/^0+(?=\d)/, "");

    steps.push(`Combine the digits to obtain decimal ${decimal}.`);

    return {
        decimal: decimal,
        bcd: groups.join(" "),
        steps: steps
    };
}


// =====================================
// 4. DECIMAL TO BCD
// =====================================

function convertDecimalToBCD(input) {
    if (!/^\d+$/.test(input)) {
        throw new Error(
            "Enter a valid non-negative whole number, such as 25."
        );
    }

    const decimal = input.replace(/^0+(?=\d)/, "");
    const digits = decimal.split("");
    const groups = [];
    const steps = [];

    steps.push(
        `The decimal number ${decimal} contains ${digits.length} digit(s).`
    );

    for (const digit of digits) {
        const group = Number(digit).toString(2).padStart(4, "0");

        groups.push(group);

        steps.push(
            `Decimal digit ${digit} becomes BCD group ${group}.`
        );
    }

    const bcd = groups.join(" ");

    steps.push(`Join the groups to obtain BCD ${bcd}.`);

    return {
        decimal: decimal,
        bcd: bcd,
        steps: steps
    };
}


// =====================================
// 5. DECIMAL TO ORDINARY BINARY
// =====================================

function convertDecimalToBinary(decimal) {
    return BigInt(decimal).toString(2);
}


// =====================================
// 6. DISPLAY THE RESULTS
// =====================================

function displayResults(decimal, bcd, binary, steps) {
    // The highlighted left box shows the BCD representation.
    inputCardLabel.textContent =
    inputMode.value === "bcd"
        ? "ENTERED BCD"
        : "GENERATED BCD";
    inputBCDResult.textContent = bcd;

    // The highlighted right box shows ordinary binary.
    binaryResult.textContent = binary;

    // Show the decimal value below the highlighted boxes.
    decimalResult.textContent = decimal;
    decimalExplanation.textContent = `${binary}₂ = ${decimal}₁₀`;

    // Show the BCD representation separately as well.
    bcdResult.textContent = bcd;

    // Add the conversion steps safely.
    stepsList.replaceChildren();

    for (const step of steps) {
        const item = document.createElement("li");
        item.textContent = step;
        stepsList.appendChild(item);
    }

    errorMessage.textContent = "";
    resultSection.hidden = false;
}


// =====================================
// 7. CLEAR RESULTS
// =====================================

function clearResults() {
    errorMessage.textContent = "";
    resultSection.hidden = true;

    inputBCDResult.textContent = "";
    decimalResult.textContent = "";
    decimalExplanation.textContent = "";
    bcdResult.textContent = "";
    binaryResult.textContent = "";

    stepsList.replaceChildren();
}


// =====================================
// 8. CONVERT BUTTON
// =====================================

convertBtn.addEventListener("click", function () {
    clearResults();

    const input = numberInput.value.trim();

    if (input === "") {
        errorMessage.textContent = "Please enter a number first.";
        return;
    }

    try {
        let result;

        if (inputMode.value === "bcd") {
            result = convertBCDToDecimal(input);
        } else {
            result = convertDecimalToBCD(input);
        }

        const decimal = result.decimal;
        const bcd = result.bcd;
        const binary = convertDecimalToBinary(decimal);
        const steps = result.steps;

        steps.push(
            `Convert decimal ${decimal} into ordinary binary ${binary}.`
        );

        displayResults(decimal, bcd, binary, steps);

    } catch (error) {
        errorMessage.textContent = error.message;
    }
});


// =====================================
// 9. CLEAR BUTTON
// =====================================

clearBtn.addEventListener("click", function () {
    numberInput.value = "";
    clearResults();
    numberInput.focus();
});

numberInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();

        convertBtn.classList.add("button-pressed");

        convertBtn.click();

        setTimeout(() => {
            convertBtn.classList.remove("button-pressed");
        }, 150);
    }
});

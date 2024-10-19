// Types
type Errors = Set<string>;
type Calculations = Map<string, number>;
const errorMessages = {
    bill: "Can’t be negative",
    persons: "Can’t be zero",
    "tip-custom": "Can’t be below 0 or above 100"
} as const;
type ErrorMessages = typeof errorMessages;
const dataValidation = {
    isZeroOrPositive: (value: number) => value >= 0,
    isPositive: (value: number) => value > 0,
    isPercentage: (value: number) => value >= 0 && value <= 100
} as const;

/**
 * Checks the reset button and disables it if every field used for calculations is set to 0.
 * 
 * @param form - The form node containing the reset button.
 * @param calculations - The calculations to check against.
 */
const checkResetButton = (form: HTMLFormElement, calculations: Calculations = new Map()): void => {
    const resetButton = form.querySelector<HTMLInputElement>(`input[type="reset"]`);
    if (resetButton) {
        const calculationsValues = [...calculations.values()];
        resetButton.disabled = calculationsValues.every(value => !value);
    }
};

/**
 * Handles the errors.
 * 
 * @param key - The key.
 * @param isValid - The input is valid or not.
 * @param errors - The set of errors to complete.
 */
const handleErrors = (key: keyof ErrorMessages, isValid: boolean, errors: Errors): void => {
    if (isValid) errors.delete(key);
    else errors.add(key);
};

/**
 * Updates the calculations map.
 * 
 * @param calculations - The calculations map to update.
 * @param key - The key to add or update.
 * @param value - The value to add.
 */
const updateCalculations = (calculations: Calculations, key: string, value: number): void => {
    calculations.set(key, value);
};

/**
 * Checks whether the form data are valid or not.
 * 
 * @param formData - The form data to check.
 * @param calculations - The map to set to prepare calculations.
 * @param errors - The errors set to fill in case of invalidation.
 */
const checkFormData = (formData: FormData, calculations: Calculations, errors: Set<string>): void => {
    for (const [key, value] of formData.entries()) {
        const digitalisedValue = Number.parseFloat(value as string);
        updateCalculations(calculations, key, digitalisedValue);
        switch (key) {
            case "persons":
                handleErrors(key, dataValidation.isPositive(digitalisedValue), errors);
                break;
            case "bill":
                handleErrors(key, dataValidation.isZeroOrPositive(digitalisedValue), errors);
                break;
            case "tip-custom":
                handleErrors(key, dataValidation.isPercentage(digitalisedValue), errors);
                break;
            default:
                break;
        }
    }
};

/**
 * Sets the error messages.
 * 
 * @param errors - The errors set.
 */
const setErrorMessages = (errors: Errors): void => {
    for (const id in errorMessages) {
        const field = document.getElementById(id);
        const invalidationMessage = document.getElementById(`${id}-invalidation-message`);
        if (field && invalidationMessage) {
            const errorId = id as keyof ErrorMessages;
            const errorMessage = errorMessages[errorId] as ErrorMessages[keyof ErrorMessages];
            invalidationMessage.textContent = errors.has(id) ? errorMessage : "";
            field.setAttribute("aria-invalid", `${errors.has(id)}`);
        }
    }
};

/**
 * Displays the amounts.
 * 
 * @param nodeList - The list of elements where to display the amounts.
 * @param amounts - The amounts to display.
 */
const displayAmounts = (nodeList: NodeListOf<Element>, amounts: [string, string] = ["0.00", "0.00"]): void => {
    const [firstNode, lastNode] = nodeList;
    const [firstAmount, lastAmount] = amounts;
    if (firstNode && lastNode) {
        firstNode.textContent = `$${firstAmount}`;
        lastNode.textContent = `$${lastAmount}`;
    }
};

/**
 * Calculates the tip.
 * 
 * @param calculations - The map containing the fields to use to calculate.
 * @returns A two-item tuple containing the tip amount per person and the total per person.
 */
const calculateTip = (calculations: Calculations): [string, string] => {
    const bill = calculations.get("bill") ?? 0;
    const customTip = calculations.get("tip-custom") ?? 0;
    const preselectionTip = calculations.get("tip-preselection") ?? 0;
    const tip = (customTip ? customTip : preselectionTip) / 100;
    const persons = calculations.get("persons") ?? 0;
    const tipPerPerson = bill * tip / persons;
    const totalPerPerson = bill / persons + tipPerPerson;
    const tipAmount = persons ? tipPerPerson.toFixed(2) : "0.00";
    const total = persons ? totalPerPerson.toFixed(2) : "0.00";
    return [tipAmount, total];
};

const app = document.querySelector<HTMLFormElement>(".app");
if (app) {
    const resultAmounts = app.querySelectorAll(".result dd");
    app.addEventListener("reset", () => {
        displayAmounts(resultAmounts);
        checkResetButton(app);
    });
    const fields = app.querySelectorAll<HTMLInputElement>(`input:not([type="reset"])`);
    const formData = new FormData();
    const formDataKeys = new Set<string>();
    for (const field of fields) {
        const { name } = field;
        formDataKeys.add(name);
        field.addEventListener("input", () => {
            formData.set(name, field.value || "0");
            const errors: Errors = new Set();
            const calculations: Calculations = new Map();
            checkFormData(formData, calculations, errors);
            setErrorMessages(errors);
            checkResetButton(app, calculations);
            if (errors.size) document.getElementById(errors.values().next().value as string)?.focus();
            else displayAmounts(resultAmounts, calculateTip(calculations));
        });
    }

    // If a number field (except the custom tip percentage field) is left blank, assume its value to be `"0"`
    const numberFields = app.querySelectorAll<HTMLInputElement>(`p input[type="number"]`);
    for (const numberField of numberFields) {
        numberField.addEventListener("blur", () => {
            if (!numberField.value) {
                numberField.value = "0";
                numberField.dispatchEvent(new InputEvent("input"));
            }
        });
    }
}

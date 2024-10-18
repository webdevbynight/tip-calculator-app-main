const errorMessages = {
    bill: "Can’t be negative",
    persons: "Can’t be zero",
    "tip-custom": "Can’t be below 0 or above 100"
} as const;
type ErrorMessages = typeof errorMessages;

const app = document.querySelector<HTMLFormElement>(".app");
const dataValidation = {
    isZeroOrPositive: (value: number) => value >= 0,
    isPositive: (value: number) => value > 0,
    isPercentage: (value: number) => value >= 0 && value <= 100
} as const;

/**
 * Handles the errors.
 * 
 * @param key - The key.
 * @param isValid - The inout is valid or not.
 * @param errors - The set of errors to complete.
 */
const handleErrors = (key: keyof ErrorMessages, isValid: boolean, errors: Set<string>) => {
    if (isValid) errors.delete(key);
    else errors.add(key);
};

if (app) {
    app.addEventListener("submit", e => {
        e.preventDefault();
        const formData = new FormData(app);
        const errors = new Set<string>();
        const calculations = new Map<string, number>();
        for (const [key, value] of formData.entries()) {
            const digitalisedValue = Number.parseFloat(value as string);
            calculations.set(key, digitalisedValue);
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
        if (errors.size) document.getElementById(errors.values().next().value as string)?.focus();
        else {
            const bill = calculations.get("bill") ?? 0;
            const customTip = calculations.get("tip-custom") ?? 0;
            const preselectionTip = calculations.get("tip-preselection") ?? 0;
            const tip = (customTip >= preselectionTip ? customTip : preselectionTip) / 100;
            const persons = calculations.get("persons") ?? 0;
            const tipPerPerson = bill * tip / persons;
            const totalPerPerson = bill / persons + tipPerPerson;
            console.log("calculations", formData, calculations);
            console.log("individual", bill, tip, persons);
            console.log("totals", tipPerPerson, totalPerPerson);

            if (tipPerPerson !== Number.POSITIVE_INFINITY && totalPerPerson !== Number.POSITIVE_INFINITY) {
                const precision = app.querySelectorAll(".result dd");
                const [first, last] = precision;
                if (first && last) {
                    first.textContent = `$${tipPerPerson.toFixed(2)}`;
                    last.textContent = `$${totalPerPerson.toFixed(2)}`;
                }
            }
        }
    });
    const fields = app.querySelectorAll<HTMLInputElement>(`input:not([type="reset"])`);
    for (const field of fields) {
        field.addEventListener("change", () => {
            app.dispatchEvent(new SubmitEvent("submit"));
        });
    }
    const numberFields = app.querySelectorAll(`p input[type="number"]`);
    for (const numberField of numberFields) {
        numberField.addEventListener("blur", function (this: HTMLInputElement) {
            if (!this.value) this.value = "0";
        });
    }
}

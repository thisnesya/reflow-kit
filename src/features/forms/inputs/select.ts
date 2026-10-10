export function selectInput(): SelectInput {
    function build(node: HTMLElement, onChange?: (input: HTMLInputElement) => void) {
        const seleted = node.querySelector("[data-value]");
        const toggle = node.querySelector("[data-toggle]");

        if (!seleted || !toggle) return;

        const isRequired = node.dataset.required === "true";
        const defaultText = seleted.textContent;

        let _value: string | null = null;

        node.querySelectorAll("input").forEach(input => {
            input.addEventListener("change", () => {
                if (input.checked) {
                    seleted.textContent = input.value;
                    $(node).triggerHandler("w-close.w-dropdown");

                    toggle.classList.add("is-selected", "is-valid");
                    toggle.classList.remove("is-invalid");

                    _value = input.value;
                }

                onChange?.(input);
            });
        });

        node.addEventListener("reset", () => {
            seleted.textContent = defaultText;
            toggle.classList.remove("is-invalid", "is-valid", "is-selected");

            _value = null;
        });

        return {
            get isValid() {
                return isRequired ? isRequired && _value : true;
            },
            get value() {
                return _value;
            }
        };
    }

    return { build };
}

export interface SelectInput {
    build(node: HTMLElement, onChange?: (input: HTMLInputElement) => void): void;
}

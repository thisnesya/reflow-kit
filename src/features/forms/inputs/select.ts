import { createEmitter } from "@app/shared/utils";

export function selectInput(): SelectInput {
    const selects = new Map<string, SelectInputInstance>();
    let idx = 0;

    function build(node: HTMLElement, options: SelectInputOptions | SelectInputOptions["onChange"] = {}) {
        const { name, onChange } = typeof options === "function" ? { onChange: options } : options;

        const seleted = node.querySelector("[data-value]");
        const toggle = node.querySelector("[data-toggle]");

        if (!seleted || !toggle) return;

        idx++;

        const inputs = node.querySelectorAll("input");
        const key = name || inputs[0]?.name || `select-${idx}`;
        const events = createEmitter<SelectInputEvents>();
        const isRequired = node.dataset.required === "true";
        const defaultText = seleted.textContent;

        let _value: string | null = null;

        inputs.forEach(input => {
            input.addEventListener("change", () => {
                if (input.checked) {
                    seleted.textContent = input.value;
                    $(node).triggerHandler("w-close.w-dropdown");

                    toggle.classList.add("is-selected", "is-valid");
                    toggle.classList.remove("is-invalid");

                    _value = input.value;
                }

                onChange?.(input);
                events.emit("change", input, instance);
            });
        });

        node.addEventListener("reset", () => {
            seleted.textContent = defaultText;
            toggle.classList.remove("is-invalid", "is-valid", "is-selected");

            _value = null;
            events.emit("reset", instance);
        });

        const instance: SelectInputInstance = {
            get element() {
                return node;
            },
            get name() {
                return key;
            },
            get isValid() {
                return isRequired ? !!_value : true;
            },
            get value() {
                return _value;
            },
            on: events.on,
            off: events.off
        };

        selects.set(key, instance);

        return instance;
    }

    return {
        build,
        get: (name: string) => selects.get(name),
        getAll: () => Object.fromEntries(selects)
    };
}

export type SelectInputOptions = {
    /** Key for `get(name)`. Defaults to the inputs' `name` attribute, then `select-N`. */
    name?: string;
    onChange?: (input: HTMLInputElement) => void;
};

export type SelectInputEvents = {
    change: (input: HTMLInputElement, select: SelectInputInstance) => void;
    reset: (select: SelectInputInstance) => void;
};

export type SelectInputInstance = {
    /** Root element the select was built from. */
    readonly element: HTMLElement;
    readonly name: string;
    readonly isValid: boolean;
    readonly value: string | null;
    /** Add a listener. Returns a function that removes it. */
    on: <K extends keyof SelectInputEvents>(event: K, listener: SelectInputEvents[K]) => () => void;
    /** Remove a listener, or every listener of `event` when none is given. */
    off: <K extends keyof SelectInputEvents>(event: K, listener?: SelectInputEvents[K]) => void;
};

export interface SelectInput {
    build(
        node: HTMLElement,
        options?: SelectInputOptions | SelectInputOptions["onChange"]
    ): SelectInputInstance | undefined;
    get(name: string): SelectInputInstance | undefined;
    getAll(): Record<string, SelectInputInstance>;
}

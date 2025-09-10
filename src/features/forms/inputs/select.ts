export function selectInput() {
    function build(node: HTMLElement) {
        const seleted = node.querySelector("[data-value]");
        const toggle = node.querySelector("[data-toggle]");

        if (!seleted || !toggle) return;

        const defaultText = seleted.textContent;

        node.querySelectorAll("input").forEach(input => {
            input.addEventListener("change", () => {
                if (input.checked) {
                    seleted.textContent = input.value;
                    $(node).triggerHandler("w-close.w-dropdown");

                    toggle.classList.add("is-selected", "is-valid");
                    toggle.classList.remove("is-invalid");
                }
            });
        });

        node.addEventListener("reset", () => {
            seleted.textContent = defaultText;
            toggle.classList.remove("is-invalid", "is-valid", "is-selected");
        });
    }

    return { build };
}

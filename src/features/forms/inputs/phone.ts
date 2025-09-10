import { phoneMasks } from "./phone-masks";

export function phoneInput() {
    return function (input: HTMLInputElement, options: PhoneInputOptions = {}) {
        const flagEl = input.parentNode?.querySelector("[data-flag]") as HTMLElement;
        let currentMask = (flagEl && flagEl.dataset.flag) || options.defaultISO || "ru";
        let iso = "";

        input.addEventListener("input", handler);
        input.addEventListener("focus", handler);
        input.addEventListener("blur", handler);

        return {
            isValid() {
                return new RegExp(
                    `^${currentMask.replace(/#/g, "\\d").replace(/(\+|\s)/g, "\\$1")}$`
                ).test(this.value);
            },

            get value() {
                return input.value.replace(/[\s#-)(]/g, "");
            },
            get iso() {
                return iso;
            }
        };

        function handler() {
            let matrix = "+###############";

            phoneMasks.forEach(({ mask, code }) => {
                let value = input.value.replace(/[\s#-)(]/g, "");

                if (value.includes(mask.replace(/[\s#]/g, ""))) {
                    if (flagEl) {
                        let prev = flagEl.getAttribute("data-flag");

                        flagEl.setAttribute("data-flag", code);
                        flagEl.classList.replace(`fi-${prev}`, `fi-${code}`);
                    }

                    matrix = mask;
                    currentMask = mask.replaceAll(" ", "");
                }
            });

            let i = 0,
                val = input.value.replace(/\D/g, "");

            input.value = matrix.replace(/(?!\+)./g, function (a) {
                return /[#\d]/.test(a) && i < val.length
                    ? val.charAt(i++)
                    : i >= val.length
                      ? ""
                      : a;
            });
        }
    };
}

type PhoneInputOptions = {
    defaultISO?: string;
};

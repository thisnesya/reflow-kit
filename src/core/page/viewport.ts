import { setCssProperty } from "@app/shared/dom";
import { debounce } from "@app/shared/utils";

export function setViewportHeight() {
    const isIos26 = (): boolean => {
        const { userAgent } = navigator;

        return userAgent.includes("iPhone") && userAgent.includes("Version/26");
    };

    if (isIos26()) {
        const update = () => setCssProperty("--dynamic-viewport-height", `${window.outerHeight}px`);

        setCssProperty("--viewport-height", `${window.outerHeight}px`);
        setCssProperty("--ios26-bar-gap", `${window.outerHeight - window.innerHeight}px`);

        update();

        window.addEventListener("resize", debounce(update, 100));
    } else {
        const update = () => setCssProperty("--dynamic-viewport-height", `${window.innerHeight}px`);

        setCssProperty("--viewport-height", `${window.innerHeight}px`);
        update();

        window.addEventListener("resize", debounce(update, 100));
    }
}

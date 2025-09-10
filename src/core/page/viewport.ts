import { setCssProperty } from "@app/shared/dom";

export function setViewportHeight() {
    setCssProperty("--viewport-height", `${window.innerHeight}px`);
    setCssProperty("--dynamic-viewport-height", `${window.innerHeight}px`);

    window.addEventListener("resize", () => {
        setCssProperty("--dynamic-viewport-height", `${window.innerHeight}px`);
    });
}

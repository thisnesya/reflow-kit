import { setCssProperty } from "@app/shared/dom";
import { debounce } from "@app/shared/utils";

export function setViewportHeight() {
    // setCssProperty("--viewport-height", `${window.innerHeight}px`);
    // setCssProperty("--dynamic-viewport-height", `${window.innerHeight}px`);

    // window.addEventListener("resize", () => {
    //     setCssProperty("--dynamic-viewport-height", `${window.innerHeight}px`);
    // });
    const update = () => setCssProperty("--dynamic-viewport-height", `${window.innerHeight}px`);

    setCssProperty("--viewport-height", `${window.innerHeight}px`);
    update();

    window.addEventListener("resize", debounce(update, 100));
}

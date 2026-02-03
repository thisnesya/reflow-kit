import type { LenisOptions } from "lenis";
import Lenis from "lenis";

export function ScrollController({ lenis, useScrollTrigger }: ScrollControllerOptions = {}) {
    const style = document.createElement("style");
    const instance = new Lenis(lenis || { lerp: 0, autoRaf: useScrollTrigger ? false : true });

    if (useScrollTrigger) {
        if (typeof window.ScrollTrigger !== "undefined") gsap();
        else document.addEventListener("DOMContentLoaded", gsap);
    }

    style.textContent =
        "html.lenis,html.lenis body{height:auto}.lenis:not(.lenis-autoToggle).lenis-stopped{overflow:clip}.lenis.lenis-smooth [data-lenis-prevent]{overscroll-behavior:contain}.lenis.lenis-smooth iframe{pointer-events:none}.lenis.lenis-autoToggle{transition-property:overflow;transition-duration:1ms;transition-behavior:allow-discrete}";
    document.head.append(style);

    return instance;

    function gsap() {
        instance.on("scroll", window.ScrollTrigger.update);
        window.gsap.ticker.add((t: number) => instance.raf(t * 1000));
        window.gsap.ticker.lagSmoothing(0);
    }
}

export type ScrollControllerOptions = {
    lenis?: LenisOptions;
    useScrollTrigger?: boolean;
};

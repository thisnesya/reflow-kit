export {};

declare global {
    /** Replaced at build time with the version from package.json. */
    const __REFLOW_VERSION__: string;

    interface Window {
        ScrollTrigger: any;
        gsap: any;
        Webflow: any;
        ReflowKit: any;
        /** Queue stub, then the instance, in the `defer`/`async` browser build. */
        reflowkit: any;
    }
}

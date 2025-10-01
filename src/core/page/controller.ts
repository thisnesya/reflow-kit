export function PageLifecycle({
    onInit,
    utilities = {}
}: PageLifecycleOptions): PageLifecycleMethods {
    const domListeners: EventListener[] = [];
    const eventListeners: Record<keyof EventsMap, EventListener> = {
        "page:before": () => {},
        "page:fontready": () => {},
        "page:domready": () => {},
        "page:ready": () => {},
        "page:restore": () => {},
        "page:leave": () => {},
        "page:load": () => {}
    };

    const domReady = new Promise<void>(resolve => {
        document.addEventListener("DOMContentLoaded", () => resolve(), { once: true });
    });

    init();

    async function init() {
        onInit?.();

        document.addEventListener("load", () => triggerEvent("page:load"));
        document.fonts.ready.then(() => triggerEvent("page:fontready"));

        domReady.then(async () => {
            await document.fonts.ready;
            await triggerEvent("page:before");
            await Promise.all(domListeners.map(cb => cb(utilities)));
        });

        await document.fonts.ready;
        await domReady;

        await triggerEvent("page:ready");
        console.log("page:%c ready", "color:green;");
    }

    document.addEventListener("click", handleClick);
    window.addEventListener("pageshow", ({ persisted }) => {
        if (persisted) triggerEvent("page:restore");
    });

    return {
        on(event: keyof EventsMap, cb: EventListener, options?: { name?: string }) {
            switch (event) {
                case "page:domready":
                    domListeners.push(cb);

                    break;
                case "page:fontready":
                    if (options?.name) listenFontLoad(options.name, cb);
                    else eventListeners[event] = cb;

                    break;
                default:
                    eventListeners[event] = cb;
            }
        }
    };

    function listenFontLoad(name: string, cb: EventListener) {
        Array.from(document.fonts)
            .find(f => f.family === name)
            ?.loaded.then(cb);
    }

    async function triggerEvent(event: keyof EventsMap) {
        if (event === "page:domready" || !eventListeners[event]) return;
        await eventListeners[event](utilities);
    }

    async function handleClick(e: MouseEvent) {
        if (!e.isTrusted) return;
        const target = (e.target as HTMLElement).closest("a");

        if (!target) return;
        if (e.button === 1 || e.ctrlKey || e.metaKey) return;

        const href = target.getAttribute("href");
        const samePage = new URL(target.href).pathname === new URL(location.href).pathname;

        if (href?.startsWith("/") && samePage) {
            e.preventDefault();
            await triggerEvent("page:leave");

            document.removeEventListener("click", handleClick);
            target.click();
            document.addEventListener("click", handleClick);
        }
    }
}

export interface PageLifecycleMethods {
    on: <E extends keyof EventsMap>(
        event: E,
        callback: EventsMap[E],
        options?: { name?: string }
    ) => void;
}

type EventListener = (tools?: Utils) => void | Promise<void>;

type EventsMap = {
    "page:before": EventListener;
    "page:fontready": EventListener;
    "page:domready": EventListener;
    "page:ready": EventListener;
    "page:restore": EventListener;
    "page:leave": EventListener;
    "page:load": EventListener;
};

export interface PageLifecycleOptions {
    onInit?: () => void;
    utilities?: Utils;
}

type Utils = Record<string, any>;

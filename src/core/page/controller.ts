export function PageLifecycle<TUtilities = Record<string, unknown>>({
    onInit,
    leavePageCondition,
    utilities = {} as TUtilities
}: PageLifecycleOptions<TUtilities>): PageLifecycleMethods<TUtilities> {
    const domListeners: DomListener<TUtilities>[] = [];
    const noop: EventListener<TUtilities> = () => {};
    const eventListeners: EventsMap<TUtilities> = {
        "page:before": noop,
        "page:fontready": noop,
        "page:domready": noop,
        "page:ready": noop,
        "page:restore": noop,
        "page:leave": noop,
        "page:load": noop
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
            await Promise.all(domListeners.map(({ cb }) => cb(utilities)));
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
        on<E extends keyof EventsMap<TUtilities>>(
            event: E,
            cb: EventsMap<TUtilities>[E],
            options?: { name?: string; scope?: string }
        ) {
            switch (event) {
                case "page:domready":
                    domListeners.push({ cb, scope: options?.scope });

                    break;
                case "page:fontready":
                    if (options?.name) listenFontLoad(options.name, cb);
                    else eventListeners[event] = cb;

                    break;
                default:
                    eventListeners[event] = cb;
            }
        },
        async reInit(scope?: string) {
            await triggerEvent("page:before");

            const listeners = domListeners.filter(l => (scope ? l.scope === scope : true));
            await Promise.all(listeners.map(runDomListener));

            await triggerEvent("page:ready");
        },
        async cleanup(scope?: string) {
            const listeners = domListeners.filter(l => (scope ? l.scope === scope : true));

            const cleanups = listeners
                .map(l => l.cleanup)
                .filter((fn): fn is CleanupFn => typeof fn === "function");

            await Promise.allSettled(cleanups.map(fn => fn()));

            listeners.forEach(l => {
                l.cleanup = undefined;
            });
        }
    };

    async function runDomListener(listener: DomListener<TUtilities>) {
        const result = await listener.cb(utilities);

        if (typeof result === "function") {
            listener.cleanup = result as CleanupFn;
        }
    }

    function listenFontLoad(name: string, cb: EventListener<TUtilities>) {
        Array.from(document.fonts)
            .find(f => f.family === name)
            ?.loaded.then(() => cb(utilities));
    }

    async function triggerEvent(event: keyof EventsMap<TUtilities>) {
        if (event === "page:domready") return;
        await eventListeners[event](utilities);
    }

    async function handleClick(e: MouseEvent) {
        if (!e.isTrusted || e.defaultPrevented) return;
        const target = (e.target as HTMLElement).closest("a");

        if (!target || !target.href) return;
        if (e.button === 1 || e.ctrlKey || e.metaKey) return;

        const href = target.getAttribute("href");
        const dest = new URL(target.href);
        const samePage = dest.pathname === new URL(location.href).pathname;

        if (leavePageCondition?.() || (href?.startsWith("/") && !samePage)) {
            e.preventDefault();
            await triggerEvent("page:leave");

            document.removeEventListener("click", handleClick);
            target.click();
            document.addEventListener("click", handleClick);
        }
    }
}

export interface PageLifecycleMethods<TUtilities = Record<string, unknown>> {
    on<E extends keyof EventsMap<TUtilities>>(
        event: E,
        callback: EventsMap<TUtilities>[E],
        options?: { name?: string; scope?: string }
    ): void;
    reInit(scope?: string): Promise<void>;
    cleanup(scope?: string): Promise<void>;
}

type EventListener<TUtilities = Record<string, unknown>> = (
    tools: TUtilities
) => void | CleanupFn | Promise<void | CleanupFn>;

type DomListener<TUtilities> = {
    cb: EventListener<TUtilities>;
    scope?: string;
    cleanup?: CleanupFn;
};

type CleanupFn = () => void | Promise<void>;

type EventsMap<TUtilities = Record<string, unknown>> = {
    "page:before": EventListener<TUtilities>;
    "page:fontready": EventListener<TUtilities>;
    "page:domready": EventListener<TUtilities>;
    "page:ready": EventListener<TUtilities>;
    "page:restore": EventListener<TUtilities>;
    "page:leave": EventListener<TUtilities>;
    "page:load": EventListener<TUtilities>;
};

export interface PageLifecycleOptions<TUtilities = Record<string, unknown>>
    extends PageLifecycleBaseOptions {
    utilities?: TUtilities;
}

export interface PageLifecycleBaseOptions {
    onInit?: () => void;
    leavePageCondition?: () => boolean;
}

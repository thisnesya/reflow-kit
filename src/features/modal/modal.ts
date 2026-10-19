import type Lenis from "lenis";
import { createEmitter } from "@app/shared/utils";

export function modalBuilder(scrollController?: Lenis): ModalBuilder {
    const modals = new Map<string, Modal>();
    let idx = 0;

    function build(
        node: HTMLElement,
        {
            name,
            onInit,
            onOpen,
            onClose,
            onOpenComplete,
            onCloseComplete,
            animationDuration = 500,
            hideOnClose = true
        }: ModalOptions = {}
    ): Modal {
        idx++;
        let timer: number | null = null;
        const key = name || `modal-${idx}`;
        const events = createEmitter<ModalEvents>();

        const closeButtons = node.querySelectorAll('[data-action="close"]');

        closeButtons.forEach(btn => btn.addEventListener("click", close));
        onInit && onInit();

        const instance: Modal = {
            get element() {
                return node;
            },
            get name() {
                return key;
            },
            open,
            close,
            isOpen,
            on: events.on,
            off: events.off,
            destroy() {
                closeButtons.forEach(btn => btn.removeEventListener("click", close));
                close();
                events.clear();
                modals.delete(key);
            }
        };

        modals.set(key, instance);

        return instance;

        function isOpen() {
            return node.classList.contains("is-open");
        }

        function open() {
            if (timer) clearTimeout(timer);
            if (scrollController) scrollController.stop();

            document.addEventListener("keyup", listenEscape);

            if (hideOnClose) node.classList.remove("u-hidden");

            void node.offsetWidth;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    node.classList.add("is-open");
                    document.body.classList.add("modal-opened");

                    onOpen && onOpen();
                    events.emit("open", instance);
                });
            });

            timer = setTimeout(() => {
                onOpenComplete && onOpenComplete();
                events.emit("openComplete", instance);
            }, animationDuration + 5);
        }

        function close() {
            if (timer) clearTimeout(timer);
            document.removeEventListener("keyup", listenEscape);

            node.classList.remove("is-open");
            document.body.classList.remove("modal-opened");

            onClose && onClose();
            events.emit("close", instance);

            timer = setTimeout(() => {
                if (scrollController) scrollController.start();

                onCloseComplete && onCloseComplete();
                events.emit("closeComplete", instance);
                if (hideOnClose) node.classList.add("u-hidden");
            }, animationDuration + 5);
        }

        function listenEscape(evt: KeyboardEvent) {
            if ("Escape" === evt.key) close();
        }
    }

    return {
        build,
        get: (name: string) => modals.get(name),
        getAll: () => Object.fromEntries(modals)
    };
}

export type ModalOptions = {
    name?: string;
    animationDuration?: number;
    hideOnClose?: boolean;
    onInit?: () => void;
    onOpen?: () => void;
    onClose?: () => void;
    onOpenComplete?: () => void;
    onCloseComplete?: () => void;
};

export type ModalEvents = {
    open: (modal: Modal) => void;
    close: (modal: Modal) => void;
    openComplete: (modal: Modal) => void;
    closeComplete: (modal: Modal) => void;
};

export type Modal = {
    /** Root element the modal was built from. */
    readonly element: HTMLElement;
    readonly name: string;
    open: () => void;
    close: () => void;
    isOpen: () => boolean;
    /** Add a listener. Returns a function that removes it. */
    on: <K extends keyof ModalEvents>(event: K, listener: ModalEvents[K]) => () => void;
    /** Remove a listener, or every listener of `event` when none is given. */
    off: <K extends keyof ModalEvents>(event: K, listener?: ModalEvents[K]) => void;
    destroy: () => void;
};

export interface ModalBuilder {
    build(node: HTMLElement, options?: ModalOptions): Modal;
    get(name: string): Modal | undefined;
    getAll(): Record<string, Modal>;
}

import type Lenis from "lenis";

export function modalBuilder(scrollController?: Lenis) {
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
            animationDuration = 500
        }: ModalOptions = {}
    ): Modal {
        idx++;

        const closeButtons = node.querySelectorAll('[data-action="close"]');

        closeButtons.forEach(btn => btn.addEventListener("click", close));
        onInit && onInit();

        const instance = {
            open,
            close,
            isOpen,
            destroy() {
                closeButtons.forEach(btn => btn.removeEventListener("click", close));
                close();
            }
        };

        modals.set(name || `modal-${idx}`, instance);

        return instance;

        function isOpen() {
            return node.classList.contains("is-open");
        }

        function open() {
            if (scrollController) scrollController.stop();

            document.addEventListener("keyup", listenEscape);

            document.body.classList.add("modal-opened");
            node.classList.add("is-open");

            onOpen && onOpen();

            setTimeout(() => {
                onOpenComplete && onOpenComplete();
            }, animationDuration + 5);
        }

        function close() {
            document.removeEventListener("keyup", listenEscape);

            node.classList.remove("is-open");
            document.body.classList.remove("modal-opened");

            onClose && onClose();

            setTimeout(() => {
                if (scrollController) scrollController.start();

                onCloseComplete && onCloseComplete();
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

type ModalOptions = {
    name?: string;
    animationDuration?: number;
    onInit?: () => void;
    onOpen?: () => void;
    onClose?: () => void;
    onOpenComplete?: () => void;
    onCloseComplete?: () => void;
};

type Modal = {
    open: () => void;
    close: () => void;
    isOpen: () => boolean;
};

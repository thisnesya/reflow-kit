import type Lenis from "lenis";

export function modalBuilder(scrollController?: Lenis) {
    const modals = new Map<string, Modal>();
    let idx = 0;

    function build(node: HTMLElement, { name, onInit, onOpen, onClose }: ModalOptions = {}): Modal {
        idx++;

        const background = $('<div class="modal-background">')[0];
        const closeButtons = node.querySelectorAll('[data-action="close"]');
        const animationDuration = 510;

        closeButtons.forEach(btn => btn.addEventListener("click", close));
        onInit && onInit();

        const instance = { open, close };
        modals.set(name || `modal-${idx}`, instance);

        return instance;

        function open() {
            if (scrollController) scrollController.stop();

            background.addEventListener("click", close);
            document.addEventListener("keyup", listenEscape);
            document.body.append(background);

            setTimeout(() => {
                document.body.classList.add("modal-opened");
                node.classList.add("is-open");

                onOpen && onOpen();
            }, 10);
        }

        function close() {
            background.removeEventListener("click", close);
            document.removeEventListener("keyup", listenEscape);

            node.classList.remove("is-open");
            document.body.classList.remove("modal-opened");

            setTimeout(() => {
                if (scrollController) scrollController.start();
                background.remove();

                onClose && onClose();
            }, animationDuration);
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
    onInit?: () => void;
    onClose?: () => void;
    onOpen?: () => void;
};

type Modal = {
    open: () => void;
    close: () => void;
};

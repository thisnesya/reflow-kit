type Callback = () => void;

const observedNodes = new WeakMap<
    HTMLElement,
    { prevClass: Set<string>; callbacks: Set<Callback> }
>();

let observer: MutationObserver | null = null;

// Created on first use so importing the package stays safe outside the browser.
function getObserver() {
    return (observer ??= new MutationObserver(list => {
        for (const { type, attributeName, target } of list) {
            if (type === "attributes" && attributeName === "class") {
                const entry = observedNodes.get(target as HTMLElement);
                if (!entry) continue;

                const currentClass = new Set((target as HTMLElement).classList);

                if (!isEqual(currentClass, entry.prevClass)) {
                    entry.prevClass = currentClass;
                    entry.callbacks.forEach(cb => cb());
                }
            }
        }
    }));
}

function isEqual(a: Set<string>, b: Set<string>): boolean {
    if (a.size !== b.size) return false;
    for (const val of a) if (!b.has(val)) return false;
    return true;
}

export function onClassChange(node: HTMLElement, callback: Callback) {
    let entry = observedNodes.get(node);

    if (!entry) {
        entry = { prevClass: new Set(node.classList), callbacks: new Set() };
        observedNodes.set(node, entry);
        getObserver().observe(node, { attributes: true, attributeFilter: ["class"] });
    }

    entry.callbacks.add(callback);

    return {
        off() {
            entry.callbacks.delete(callback);
            if (entry.callbacks.size === 0) {
                getObserver().takeRecords();
                observedNodes.delete(node);
            }
        }
    };
}

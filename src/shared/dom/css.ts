export function setCssProperty(name: string, value: string, node?: HTMLElement) {
    if (node) node.style.setProperty(name, value);
    else document.documentElement.style.setProperty(name, value);
}

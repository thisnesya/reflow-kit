export function getAttribute(node: HTMLElement, name: string) {
    return node.getAttribute(name) || node.attributes.getNamedItem(name) || null;
}

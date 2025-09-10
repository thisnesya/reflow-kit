export function toArray(value: string, scope?: Document | Element): Element[] {
    if (!value || typeof value != "string") return [];

    const context: Document | Element = scope || document;

    return Array.from(context.querySelectorAll(value));
}

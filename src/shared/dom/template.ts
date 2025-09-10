export function getTemplate(id: string) {
    const t = (document.getElementById(`template_${id}`) ||
        document.getElementById(id)) as HTMLTemplateElement;
    return t && t.tagName === "TEMPLATE" ? t.content.firstChild?.cloneNode(true) : null;
}

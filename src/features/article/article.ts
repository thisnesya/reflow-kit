export function article() {
    function render({ richtext, renderFunctions, container }: RenderArticleOptions) {
        const tags = Object.keys(renderFunctions);
        const processedHtml = removeWrappingPTags(richtext.innerHTML, tags);

        const parser = new DOMParser();
        const doc = parser.parseFromString(processedHtml, 'text/html');
        const result = processNode(doc.body);

        if (result) [...result.childNodes].forEach((n) => container.append(n));
        return container;

        function removeWrappingPTags(html: string, tags: string[]) {
            const unescapedHtml = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            const regex = new RegExp(
                `<p>\\s*(<\\/?(${tags.join('|')})(?:\\s[^>]*)?>)\\s*<\\/p>`,
                'gi'
            );
            return unescapedHtml.replace(regex, '$1');
        }

        function processNode(node: HTMLElement | ChildNode | null) {
            if (!node) return;

            if (node.nodeType === Node.TEXT_NODE) {
                return document.createTextNode(node.textContent || '');
            }

            if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = (node as HTMLElement).tagName.toLowerCase();
                const renderFunction = getRenderFunction(tagName);

                if (renderFunction) {
                    const children = Array.from(node.childNodes || [])
                        .map(processNode)
                        .filter(Boolean) as Node[];

                    return renderFunction(node as HTMLElement, children);
                } else {
                    const clone = node.cloneNode(false);
                    Array.from(node.childNodes).forEach((child) => {
                        const processedChild = processNode(child);
                        if (processedChild) {
                            clone.appendChild(processedChild);
                        }
                    });
                    return clone;
                }
            }

            return null;
        }

        function getRenderFunction(tagName: string) {
            return renderFunctions[tagName] || null;
        }
    }

    return { render };
}

type RenderArticleOptions = {
    richtext: HTMLElement;
    container: HTMLElement;
    renderFunctions: {
        [key: string]: RenderFunction;
    };
};

export type RenderFunction = (node: HTMLElement, children: Node[]) => HTMLElement | Node;

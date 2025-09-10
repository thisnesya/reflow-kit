import type { RenderFunction } from '../article';

export function section(template: HTMLElement): RenderFunction {
    return function (_, nodes) {
        const section = template.cloneNode(true);
        nodes.forEach((n) => section.appendChild(n));
        return section;
    };
}

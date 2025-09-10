import type { RenderFunction } from '../article';

export function heading(classList: string[]): RenderFunction {
    return function (node) {
        node.classList.add(...classList);
        return node.cloneNode(true);
    };
}

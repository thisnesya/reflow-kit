import type { RenderFunction } from '../article';

export function list(classList: string[]): RenderFunction {
    return function (node) {
        node.classList.add(...classList);
        return node.cloneNode(true);
    };
}

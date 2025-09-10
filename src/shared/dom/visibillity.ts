import { appConfig } from "@app/constants";

export function hideElement(node: HTMLElement) {
    node.classList.add(appConfig.classes.hidden);
}

export function showElement(node: HTMLElement) {
    node.classList.remove(appConfig.classes.hidden);
}

export function toggleElement(node: HTMLElement) {
    node.classList.toggle(appConfig.classes.hidden);
}

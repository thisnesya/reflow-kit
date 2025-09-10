export function getFormData(node: HTMLFormElement) {
    const result: Data = {};

    try {
        for (let [key, value] of new FormData(node)) {
            result[key] = value;
        }
    } catch {
        console.warn("getFormData: node is not Form");
    }

    return result;
}

type Data = {
    [key: string]: any;
};

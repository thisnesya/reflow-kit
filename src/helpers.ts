export function defineProperty(obj: any, key: string, value: any) {
    Object.defineProperty(obj, key, {
        value,
        enumerable: false
    });
}

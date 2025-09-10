export function nthElement(arr: Array<any> = [], every: number = 1, from: number = 0) {
    const result = [];

    for (let i = from - 1; i < arr.length; i += every) {
        result.push(arr[i]);
    }

    return result;
}

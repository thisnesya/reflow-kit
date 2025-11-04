export function getEven(arr: any[]) {
    return arr.filter((_, i) => i % 2 === 0);
}

export function getOdd(arr: any[]) {
    return arr.filter((_, i) => i % 2 === 1);
}

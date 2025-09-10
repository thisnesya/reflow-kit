export function getQueryParam(name: string, url?: string) {
    try {
        return new URL(url || window.location.href).searchParams.get(name);
    } catch {
        return null;
    }
}

export function getQueryParams(url?: string) {
    const res: Params = {};

    try {
        new URL(url || window.location.href).searchParams.forEach((value, key) => {
            res[key] = value;
        });
    } catch {}

    return res;
}

type Params = {
    [key: string]: string;
};

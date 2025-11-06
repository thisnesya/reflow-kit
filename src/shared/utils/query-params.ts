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

export function getUtmQueries() {
    return {
        source: getQueryParam("utm_source"),
        medium: getQueryParam("utm_medium"),
        campaign: getQueryParam("utm_campaign"),
        term: getQueryParam("utm_term"),
        content: getQueryParam("utm_content"),
        id: getQueryParam("utm_id")
    };
}

type Params = {
    [key: string]: string;
};

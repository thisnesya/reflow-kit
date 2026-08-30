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

export function setQueryParam(
    name: string,
    value: string | number | boolean,
    options: QueryParamOptions = {}
) {
    updateQuery(params => params.set(name, String(value)), options);
}

export function deleteQueryParam(name: string, options: QueryParamOptions = {}) {
    updateQuery(params => params.delete(name), options);
}

function updateQuery(mutate: (params: URLSearchParams) => void, { push }: QueryParamOptions) {
    try {
        const url = new URL(window.location.href);

        mutate(url.searchParams);

        const next = `${url.pathname}${url.search}${url.hash}`;

        if (push) window.history.pushState(null, "", next);
        else window.history.replaceState(null, "", next);
    } catch {
        console.warn("Failed to update query params");
    }
}

export type QueryParamOptions = {
    /** Add a history entry instead of replacing the current one. Default: `false`. */
    push?: boolean;
};

type Params = {
    [key: string]: string;
};

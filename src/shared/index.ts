import { getFormData } from "@app/features";
import {
    debounce,
    deleteQueryParam,
    getQueryParam,
    getQueryParams,
    getUtmQueries,
    nthElement,
    setQueryParam,
    sleep,
    toArray
} from "./utils";
import {
    getAttribute,
    getTemplate,
    hideElement,
    onClassChange,
    setCssProperty,
    showElement,
    toggleElement
} from "./dom";
import { restartWebflow, webflowReady } from "./webflow";

const utils = {
    getFormData,
    getQueryParam,
    getQueryParams,
    getUtmQueries,
    setQueryParam,
    deleteQueryParam,
    getTemplate,
    setCssProperty,
    onClassChange,

    sleep,
    toArray,
    debounce,
    nthElement,

    hideElement,
    showElement,
    toggleElement,
    getAttribute,

    restartWebflow,
    webflowReady
};

export { utils };

/** The built-in utilities, inferred from the `utils` bag above. */
export type Utils = typeof utils;

import { getFormData } from "@app/features";
import {
    debounce,
    getQueryParam,
    getQueryParams,
    getUtmQueries,
    nthElement,
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

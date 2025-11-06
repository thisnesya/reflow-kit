import { getFormData } from "@app/features";
import {
    debounce,
    getQueryParam,
    getQueryParams,
    nthElement,
    sleep,
    toArray,
    getEven,
    getOdd
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
    getTemplate,
    setCssProperty,
    onClassChange,

    sleep,
    toArray,
    debounce,
    nthElement,
    getEven,
    getOdd,

    hideElement,
    showElement,
    toggleElement,
    getAttribute,

    restartWebflow,
    webflowReady
};

export { utils };

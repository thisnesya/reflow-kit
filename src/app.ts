import type { AppConfig } from "@app/types";
import { version } from "../package.json";
import { DeviceDetector, PageLifecycle, ScrollController, setViewportHeight } from "@app/core";
import { article, modalBuilder, selectInput } from "@app/features";
import { utils } from "./shared";
import { defineProperty } from "@app/helpers";

function init(options: AppConfig = {}) {
    setViewportHeight();

    const { isMobile, isTablet, isDesktop } = DeviceDetector(options.devices || {});
    const scroll = ScrollController({ ...options.scroll });
    const modal = modalBuilder(scroll);

    const utilities = {
        ...utils,
        isMobile,
        isTablet,
        isDesktop,
        scroll
    };

    const components = {
        modal,
        selectInput: selectInput(),
        article: article()
        // phoneInput: phoneInput()
    };

    const { on, reInit } = PageLifecycle({ ...(options.page || {}), utilities });

    const instance = {
        on,
        reInit,
        utils: utilities,
        scroll,
        components,
        content: {}
    };

    defineProperty(instance, "_developer", "t.me/drmc0de");
    defineProperty(instance, "_version", version);

    return instance;
}

window.ReflowKit = { init };
export { init };

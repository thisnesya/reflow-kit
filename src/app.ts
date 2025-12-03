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

    const utilities: Record<string, unknown> = {
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

    const { on, reInit, cleanup } = PageLifecycle({ ...(options.page || {}), utilities });

    function registerUtility(name: string, value: unknown) {
        utilities[name] = value;
    }

    const instance = {
        on,
        reInit,
        cleanup,
        registerUtility,
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

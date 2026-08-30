import type { AppConfig, ReflowKitInstance, ReflowKitUtils } from "@app/types";
import { DeviceDetector, PageLifecycle, ScrollController, setViewportHeight } from "@app/core";
import { article, modalBuilder, selectInput } from "@app/features";
import { utils } from "./shared";
import { defineProperty } from "@app/helpers";

function init(options: AppConfig = {}): ReflowKitInstance {
    setViewportHeight();

    const { isMobile, isTablet, isDesktop } = DeviceDetector(options.devices || {});
    const scroll = ScrollController({ ...options.scroll });
    const modal = modalBuilder(scroll);

    // CustomUtils entries are filled in at runtime via registerUtility.
    const utilities = {
        ...utils,
        isMobile,
        isTablet,
        isDesktop,
        scroll
    } as ReflowKitUtils;

    const components = {
        modal,
        selectInput: selectInput(),
        article: article()
        // phoneInput: phoneInput()
    };

    const { on, refresh, cleanup, emit } = PageLifecycle({
        ...(options.page || {}),
        utilities,
        scroll
    });

    function registerUtility(name: string, value: unknown) {
        (utilities as unknown as Record<string, unknown>)[name] = value;
    }

    const instance = {
        on,
        refresh,
        cleanup,
        emit,
        registerUtility,
        utils: utilities,
        scroll,
        components,
        content: {} as Record<any, unknown>
    };

    defineProperty(instance, "_developer", "t.me/drmc0de");
    defineProperty(instance, "_version", __REFLOW_VERSION__);

    return instance;
}

export { init };

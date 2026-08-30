import type Lenis from "lenis";
import type {
    DeviceDetectorOptions,
    PageLifecycleBaseOptions,
    PageLifecycleMethods,
    ScrollControllerOptions
} from "@app/core";
import type { Article, ModalBuilder, SelectInput } from "@app/features";
import type { Utils } from "@app/shared";

export interface AppConfig {
    scroll?: ScrollControllerOptions;
    page?: PageLifecycleBaseOptions;
    devices?: DeviceDetectorOptions;
}

export interface ReflowKitComponents {
    modal: ModalBuilder;
    selectInput: SelectInput;
    article: Article;
}

/** Utilities every instance ships with. */
export interface BaseUtils extends Utils {
    isMobile(): boolean;
    isTablet(): boolean;
    isDesktop(): boolean;
    scroll: Lenis;
}

/**
 * Augmentation point for utilities added at runtime with `registerUtility`.
 * Declare them once and they show up on `instance.utils` and in every listener:
 *
 * ```ts
 * declare module "@reflow/kit" {
 *     interface CustomUtils {
 *         gsap: typeof import("gsap").gsap;
 *     }
 * }
 * ```
 */
export interface CustomUtils {}

export type ReflowKitUtils = BaseUtils & CustomUtils;

export interface ReflowKitInstance extends PageLifecycleMethods<ReflowKitUtils> {
    /**
     * Register an extra utility exposed on `utils` and to every lifecycle listener.
     * Declare it on {@link CustomUtils} to have it typed.
     */
    registerUtility<K extends string>(
        name: K,
        value: K extends keyof CustomUtils ? CustomUtils[K] : unknown
    ): void;
    utils: ReflowKitUtils;
    scroll: Lenis;
    components: ReflowKitComponents;
    content: Record<any, unknown>;
}

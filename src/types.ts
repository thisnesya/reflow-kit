import type Lenis from "lenis";
import type {
    DeviceDetectorOptions,
    PageLifecycleBaseOptions,
    PageLifecycleMethods,
    ScrollControllerOptions
} from "@app/core";
import type { Article, ModalBuilder, SelectInput } from "@app/features";

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

export interface ReflowKitInstance extends PageLifecycleMethods {
    /** Register an extra utility exposed to every page lifecycle listener. */
    registerUtility(name: string, value: unknown): void;
    utils: Record<string, unknown>;
    scroll: Lenis;
    components: ReflowKitComponents;
    content: Record<any, unknown>;
}

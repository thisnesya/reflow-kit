import type {
    DeviceDetectorOptions,
    PageLifecycleOptions,
    ScrollControllerOptions
} from "@app/core";

export interface AppConfig {
    scroll?: ScrollControllerOptions;
    page?: PageLifecycleOptions;
    devices?: DeviceDetectorOptions;
}

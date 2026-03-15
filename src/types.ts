import type {
    DeviceDetectorOptions,
    PageLifecycleBaseOptions,
    ScrollControllerOptions
} from "@app/core";

export interface AppConfig {
    scroll?: ScrollControllerOptions;
    page?: PageLifecycleBaseOptions;
    devices?: DeviceDetectorOptions;
}

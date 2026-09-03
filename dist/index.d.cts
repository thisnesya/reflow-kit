import Lenis from 'lenis';
import { LenisOptions } from 'lenis';

export interface DeviceDetectorOptions {
	mobile?: {
		min?: number;
		max?: number;
	};
	tablet?: {
		min?: number;
		max?: number;
	};
	desktop?: {
		min?: number;
		max?: number;
	};
}
export interface PageLifecycleMethods<TUtilities = Record<string, unknown>> {
	on<E extends keyof EventsMap<TUtilities>>(event: E, callback: EventsMap<TUtilities>[E], options?: {
		name?: string;
		scope?: string;
	}): void;
	refresh(scope?: string | string[]): Promise<void>;
	cleanup(scope?: string | string[], detach?: boolean): Promise<void>;
	emit(event: keyof EventsMap<TUtilities>): Promise<void>;
}
type EventListener$1<TUtilities = Record<string, unknown>> = (tools: TUtilities) => void | CleanupFn | Promise<void | CleanupFn>;
type CleanupFn = () => void | Promise<void>;
type EventsMap<TUtilities = Record<string, unknown>> = {
	"page:before": EventListener$1<TUtilities>;
	"page:fontready": EventListener$1<TUtilities>;
	"page:domready": EventListener$1<TUtilities>;
	"page:ready": EventListener$1<TUtilities>;
	"page:restore": EventListener$1<TUtilities>;
	"page:leave": EventListener$1<TUtilities>;
	"page:load": EventListener$1<TUtilities>;
};
export interface PageLifecycleBaseOptions {
	onInit?: () => void;
	lockScrollUntilReady?: boolean;
	triggerPageLeave?: boolean | {
		condition?: () => boolean;
	};
}
export type ScrollControllerOptions = {
	lenis?: LenisOptions;
	useScrollTrigger?: boolean;
};
export type ModalOptions = {
	name?: string;
	animationDuration?: number;
	hideOnClose?: boolean;
	onInit?: () => void;
	onOpen?: () => void;
	onClose?: () => void;
	onOpenComplete?: () => void;
	onCloseComplete?: () => void;
};
export type Modal = {
	open: () => void;
	close: () => void;
	isOpen: () => boolean;
};
export interface ModalBuilder {
	build(node: HTMLElement, options?: ModalOptions): Modal;
	get(name: string): Modal | undefined;
	getAll(): Record<string, Modal>;
}
export type RenderArticleOptions = {
	richtext: HTMLElement;
	container: HTMLElement;
	renderFunctions: {
		[key: string]: RenderFunction;
	};
};
export type RenderFunction = (node: HTMLElement, children: Node[]) => HTMLElement | Node;
export interface Article {
	render(options: RenderArticleOptions): HTMLElement;
}
export interface SelectInput {
	build(node: HTMLElement, onChange?: (input: HTMLInputElement) => void): void;
}
declare function getFormData(node: HTMLFormElement): Data;
type Data = {
	[key: string]: any;
};
declare function debounce<F extends (...args: any[]) => void>(func: F, ms: number): (this: unknown, ...args: Parameters<F>) => void;
declare function sleep(ms: number): Promise<unknown>;
declare function toArray(value: string, scope?: Document | Element): Element[];
declare function nthElement(arr?: Array<any>, every?: number, from?: number): any[];
declare function getQueryParam(name: string, url?: string): string | null;
declare function getQueryParams(url?: string): Params;
declare function getUtmQueries(): {
	source: string | null;
	medium: string | null;
	campaign: string | null;
	term: string | null;
	content: string | null;
	id: string | null;
};
declare function setQueryParam(name: string, value: string | number | boolean, options?: QueryParamOptions): void;
declare function deleteQueryParam(name: string, options?: QueryParamOptions): void;
type QueryParamOptions = {
	/** Add a history entry instead of replacing the current one. Default: `false`. */
	push?: boolean;
};
type Params = {
	[key: string]: string;
};
declare function setCssProperty(name: string, value: string, node?: HTMLElement): void;
declare function hideElement(node: HTMLElement): void;
declare function showElement(node: HTMLElement): void;
declare function toggleElement(node: HTMLElement): void;
declare function getAttribute(node: HTMLElement, name: string): string | Attr | null;
declare function getTemplate(id: string): Node | null | undefined;
type Callback = () => void;
declare function onClassChange(node: HTMLElement, callback: Callback): {
	off(): void;
};
declare function restartWebflow(): Promise<unknown>;
declare const utils: {
	getFormData: typeof getFormData;
	getQueryParam: typeof getQueryParam;
	getQueryParams: typeof getQueryParams;
	getUtmQueries: typeof getUtmQueries;
	setQueryParam: typeof setQueryParam;
	deleteQueryParam: typeof deleteQueryParam;
	getTemplate: typeof getTemplate;
	setCssProperty: typeof setCssProperty;
	onClassChange: typeof onClassChange;
	sleep: typeof sleep;
	toArray: typeof toArray;
	debounce: typeof debounce;
	nthElement: typeof nthElement;
	hideElement: typeof hideElement;
	showElement: typeof showElement;
	toggleElement: typeof toggleElement;
	getAttribute: typeof getAttribute;
	restartWebflow: typeof restartWebflow;
	webflowReady: () => Promise<unknown>;
};
type Utils = typeof utils;
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
export interface CustomUtils {
}
export type ReflowKitUtils = BaseUtils & CustomUtils;
export interface ReflowKitInstance extends PageLifecycleMethods<ReflowKitUtils> {
	/**
	 * Register an extra utility exposed on `utils` and to every lifecycle listener.
	 * Declare it on {@link CustomUtils} to have it typed.
	 */
	registerUtility<K extends string>(name: K, value: K extends keyof CustomUtils ? CustomUtils[K] : unknown): void;
	utils: ReflowKitUtils;
	scroll: Lenis;
	components: ReflowKitComponents;
	content: Record<any, unknown>;
}
export declare function init(options?: AppConfig): ReflowKitInstance;

export {};

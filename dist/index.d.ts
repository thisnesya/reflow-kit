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
	refresh(scope?: string): Promise<void>;
	cleanup(scope?: string, detach?: boolean): Promise<void>;
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
export declare function init(options?: AppConfig): ReflowKitInstance;

export {};

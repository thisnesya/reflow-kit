export type Listener = (...args: any[]) => void;

export function createEmitter<E extends Record<string, Listener>>() {
    const listeners = new Map<keyof E, Set<Listener>>();

    return {
        on<K extends keyof E>(event: K, listener: E[K]) {
            if (!listeners.has(event)) listeners.set(event, new Set());
            listeners.get(event)!.add(listener);

            return () => listeners.get(event)?.delete(listener);
        },
        off<K extends keyof E>(event: K, listener?: E[K]) {
            if (listener) listeners.get(event)?.delete(listener);
            else listeners.delete(event);
        },
        emit<K extends keyof E>(event: K, ...args: Parameters<E[K]>) {
            listeners.get(event)?.forEach(listener => listener(...args));
        },
        clear() {
            listeners.clear();
        }
    };
}

export function debounce<F extends (...args: any[]) => void>(func: F, ms: number) {
    let lastCall: number | null = null;
    let lastCallTimer: ReturnType<typeof setTimeout> | null = null;

    return function (this: unknown, ...args: Parameters<F>) {
        const now = Date.now();
        if (lastCall && now - lastCall <= ms && lastCallTimer) {
            clearTimeout(lastCallTimer);
        }
        lastCall = now;
        lastCallTimer = setTimeout(() => func.apply(this, args), ms);
    };
}

import type { AppConfig } from "@app/types";
import { init } from "./app";

/**
 * Browser build for `defer`/`async` loading. Calls made before the script loads are queued by the
 * inline stub (see README) on `window.reflowkit.q`:
 *
 * ```html
 * <script>
 *     !function(w){var k=w.reflowkit=w.reflowkit||{q:[]};"init on registerUtility refresh cleanup emit ready".split(" ").forEach(function(m){k[m]=k[m]||function(){k.q.push([m,arguments])}})}(window);
 * </script>
 * ```
 *
 * On load the kit is initialized with the queued `init` options, the stub object is turned into
 * the real instance in place (so every reference to it keeps working) and the queue is replayed.
 */
type QueuedCall = [method: string, args: ArrayLike<unknown>];
type ReadyCallback = (instance: any) => void;

const kit = window.reflowkit || (window.reflowkit = {});
const queue: QueuedCall[] = Array.isArray(kit.q) ? kit.q : [];

let options: AppConfig | undefined;
const calls = queue.filter(([method, args]) => {
    if (method !== "init") return true;
    options = args[0] as AppConfig | undefined;
    return false;
});

const instance = init(options);

delete kit.q;
Object.defineProperties(kit, Object.getOwnPropertyDescriptors(instance));

kit.init = () => {
    console.warn("[reflowkit] already initialized, init options are ignored");
    return kit;
};
kit.ready = (cb: ReadyCallback) => cb(kit);

for (const [method, args] of calls) {
    try {
        if (typeof kit[method] !== "function") throw new Error(`unknown method "${method}"`);
        kit[method](...Array.from(args));
    } catch (e) {
        console.error(`[reflowkit] queued "${method}" call failed:`, e);
    }
}

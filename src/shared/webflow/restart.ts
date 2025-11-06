export async function restartWebflow() {
    const { Webflow } = window;
    if (!Webflow || !("destroy" in Webflow) || !("ready" in Webflow) || !("require" in Webflow))
        return;

    Webflow.destroy();
    Webflow.ready();

    return new Promise(resolve => Webflow.push(() => resolve(undefined)));
}

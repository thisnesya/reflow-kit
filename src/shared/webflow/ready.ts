export const webflowReady = async () => {
    return new Promise(resolve => {
        window.Webflow ||= [];
        window.Webflow.push(resolve);
    });
};

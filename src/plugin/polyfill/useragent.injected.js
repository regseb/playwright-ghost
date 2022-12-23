const userAgentHandler = {
    get(target, thisArg, args) {
        // TODO Pourquoi Reflect.apply(target, thisArg, args) ne fonctionne pas.
        return target.apply(thisArg, args)
                     .replace("Headless", "");
    },
};
const appVersionHandler = {
    get(target, thisArg, args) {
        return target.apply(thisArg, args)
                     .replace("Headless", "");
    },
};

if ("Navigator" in globalThis) {
    Ghost.defineProperty(Navigator, "userAgent", userAgentHandler);
    Ghost.defineProperty(Navigator, "appVersion", appVersionHandler);
}

if ("WorkerNavigator" in globalThis) {
    Ghost.defineProperty(WorkerNavigator, "userAgent", userAgentHandler);
    Ghost.defineProperty(WorkerNavigator, "appVersion", appVersionHandler);
}

Ghost.defineProperty(Navigator, "userAgent", {
    get(target, thisArg, args) {
        // TODO Pourquoi Reflect.apply(target, thisArg, args) ne fonctionne pas.
        return target.apply(thisArg, args)
                     .replace("Headless", "");
    },
});

Ghost.defineProperty(Navigator, "appVersion", {
    get(target, thisArg, args) {
        return target.apply(thisArg, args)
                     .replace("Headless", "");
    },
});

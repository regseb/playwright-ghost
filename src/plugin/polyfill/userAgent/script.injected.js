Ghost.defineProperty(Object.getPrototypeOf(navigator), "userAgent", {
    get(nativeFn) { return nativeFn().replace("Headless", ""); },
});

Ghost.defineProperty(Object.getPrototypeOf(navigator), "appVersion", {
   get(nativeFn) { return nativeFn().replace("Headless", ""); },
});

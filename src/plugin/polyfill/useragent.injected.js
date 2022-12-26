/**
 * @module
 * @see https://sites.google.com/a/chromium.org/dev/updates/ua-reduction
 */

const handler = {
    get(target, thisArg, args) {
        // TODO Pourquoi Reflect.apply(target, thisArg, args) ne fonctionne pas.
        return target.apply(thisArg, args)
                     // Enlever "Headless" de "ChromeHeadless".
                     .replace("Headless", "")
                     // Utiliser "0" pour les numéros de versions des MINOR,
                     // BUILD et PATCH.
                     .replace(/(?<begin>Chrome\/\d+)\.\d+\.\d+\.\d+ /u,
                              "$<begin>.0.0.0 ");
    },
};

if ("Navigator" in globalThis) {
    Ghost.defineProperty(Navigator, "userAgent", handler);
    Ghost.defineProperty(Navigator, "appVersion", handler);
}

if ("WorkerNavigator" in globalThis) {
    Ghost.defineProperty(WorkerNavigator, "userAgent", handler);
    Ghost.defineProperty(WorkerNavigator, "appVersion", handler);
}

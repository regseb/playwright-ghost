/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @typedef {import("playwright").BrowserType} BrowserType
 */

/**
 * Enlève l'option <code>--enable-automation</code> dans Chromium.
 *
 * @param {Object}      [options]   Les options de création d'un
 *                                  <code>Browser</code>.
 * @param {BrowserType} browserType Le type de navigateur.
 * @returns {Object|undefined} Les nouvelles options.
 */
const disable = (options, browserType) => {
    if ("chromium" === browserType.name()) {
        return {
            ...options,
            ignoreDefaultArgs: [
                "--enable-automation",
                ...(options?.ignoreDefaultArgs ?? []),
            ],
        };
    }
    return options;
};

/**
 * Crée un plugin pour désactiver la fonctionnalité
 * <code>--enable-automation</code> dans Chromium.
 */
export default function webdriverPlugin() {
    return {
        "BrowserType.launch:before": (args, { obj: browserType }) => {
            return [disable(args[0], browserType)];
        },

        "BrowserType.launchPersistentContext:before": (
            args,
            { obj: browserType },
        ) => {
            return [args[0], disable(args[1], browserType)];
        },
    };
}

/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @typedef {import("playwright").BrowserType} BrowserType
 */

/**
 * Désactive la fonctionnalité <code>AutomationControlled</code> dans Chromium.
 * Le navigateur sera toujours controllable par Playwright, mais la variable
 * <code>navigator.webdriver</code> sera <code>false</code>.
 *
 * @param {Object}      [options]   Les options de création d'un <code>Browser</code>.
 * @param {BrowserType} browserType Le type de navigateur.
 * @returns {Object} Les nouvelles options.
 */
const disable = (options, browserType) => {
    if ("chromium" === browserType.name()) {
        return {
            ...options,
            args: [
                "--disable-blink-features=AutomationControlled",
                ...(options?.args ?? []),
            ],
        };
    }
    return options;
};

/**
 * Crée un plugin pour passer à <code>false</code> la variable
 * <code>navigator.webdriver</code> dans Chromium.
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

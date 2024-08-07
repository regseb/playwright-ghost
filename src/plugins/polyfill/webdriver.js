/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @import { BrowserType } from "playwright"
 * @import { ContextBefore } from "../../hook.js"
 */

/**
 * Désactive la fonctionnalité <code>AutomationControlled</code> dans Chromium.
 * Le navigateur sera toujours controllable par Playwright, mais la variable
 * <code>navigator.webdriver</code> sera <code>false</code>.
 *
 * @param {Record<string, any>|undefined} options     Les options de création
 *                                                    d'un <code>Browser</code>.
 * @param {BrowserType}                   browserType Le type de navigateur.
 * @returns {Record<string, any>|undefined} Les nouvelles options.
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
        /**
         * Modifie les options de lancement du navigateur.
         *
         * @param {any[]}                      args    Les paramètres de la
         *                                             méthode.
         * @param {ContextBefore<BrowserType>} context Le contexte du crochet.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "BrowserType.launch:before": (args, { obj: browserType }) => {
            return [disable(args[0], browserType)];
        },

        /**
         * Modifie les options de lancement du navigateur.
         *
         * @param {any[]}                      args    Les paramètres de la
         *                                             méthode.
         * @param {ContextBefore<BrowserType>} context Le contexte du crochet.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "BrowserType.launchPersistentContext:before": (
            args,
            { obj: browserType },
        ) => {
            return [args[0], disable(args[1], browserType)];
        },
    };
}

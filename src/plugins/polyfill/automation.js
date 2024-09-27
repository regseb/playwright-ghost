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
 * Enlève l'option `--enable-automation` dans Chromium.
 *
 * @param {Record<string, any>|undefined} options     Les options de création
 *                                                    d'un `Browser`.
 * @param {BrowserType}                   browserType Le type de navigateur.
 * @returns {Record<string, any>|undefined} Les nouvelles options.
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
 * Crée un plugin pour désactiver la fonctionnalité `--enable-automation` dans
 * Chromium.
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

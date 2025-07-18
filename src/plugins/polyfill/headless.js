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
 * Modifie le `channel` du navigateur Chromium.
 *
 * @param {Record<string, any>|undefined} options     Les options de création
 *                                                    d'un `Browser`.
 * @param {BrowserType}                   browserType Le type de navigateur.
 * @returns {Record<string, any>|undefined} Les nouvelles options.
 * @see https://playwright.dev/docs/browsers#opt-in-to-new-headless-mode
 */
const changeChannel = (options, browserType) => {
    if ("chromium" === browserType.name()) {
        return {
            channel: "chromium",
            ...options,
        };
    }
    return options;
};

/**
 * Crée le plugin pour corriger de nombreuses différences dans les APIs
 * JavaScript avec le nouveau mode _headless_ de Chromium.
 *
 * @returns {Record<string, Function>} Les crochets du plugin.
 * @see https://developer.chrome.com/articles/new-headless/
 */
export default function polyfillHeadlessPlugin() {
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
            return [changeChannel(args[0], browserType)];
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
            return [args[0], changeChannel(args[1], browserType)];
        },
    };
}

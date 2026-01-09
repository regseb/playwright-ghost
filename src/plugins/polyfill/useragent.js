/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @import { Browser, BrowserType } from "playwright"
 * @import { ContextBefore } from "../../hook.js"
 */

/**
 * Modifie l'agent utilisateur (_user agent_) du navigateur.
 *
 * @param {Record<string, any>|undefined} options      Les options de création
 *                                                     d'un `Browser`.
 * @param {string}                        userAgent    L'agent utilisateur à
 *                                                     utiliser.
 * @param {BrowserType}                   browserType  Le type de navigateur.
 * @param {string}                        functionName Le nom de la fonction
 *                                                     appellée.
 * @returns {Record<string, any>|undefined} Les nouvelles options.
 */
const changeUserAgentFromBrowserType = (
    options,
    userAgent,
    browserType,
    functionName,
) => {
    if ("chromium" === browserType.name()) {
        return {
            ...options,
            // Ne pas utiliser l'option "userAgent" des contextes, car elle ne
            // modifie pas l'agent utilisateur des workers.
            args: [`--user-agent=${userAgent}`, ...(options?.args ?? [])],
        };
    }
    if ("launchPersistentContext" === functionName) {
        return {
            userAgent,
            ...options,
        };
    }
    return options;
};

/**
 * Modifie l'agent utilisateur (_user agent_) du navigateur.
 *
 * @param {Record<string, any>|undefined} options   Les options de création d'un
 *                                                  `BrowserContext`.
 * @param {string}                        userAgent L'agent utilisateur à
 *                                                  utiliser.
 * @param {Browser}                       browser   Le navigateur.
 * @returns {Record<string, any>|undefined} Les nouvelles options.
 */
const changeUserAgentFromBrowser = (options, userAgent, browser) => {
    if ("chromium" !== browser.browserType().name()) {
        return {
            userAgent,
            ...options,
        };
    }
    return options;
};

/**
 * @typedef {Object} PolyfillUserAgentOptions Les options du plugin
 *                                            `polyfill.userAgent`.
 * @prop {string} userAgent Le _user agent_ à utiliser.
 */

/**
 * Crée un plugin pour changer l'agent utilisateur (_user agent_) du navigateur.
 *
 * @param {PolyfillUserAgentOptions} options Les options du plugin
 *                                           `polyfill.userAgent`.
 * @returns {Record<string, Function>} Les crochets du plugin.
 * @see https://developer.mozilla.org/Web/HTTP/Headers/User-Agent
 */
export default function polyfillUserAgentPlugin(options) {
    const userAgent = options.userAgent;

    return {
        /**
         * Modifie les options de lancement du navigateur.
         *
         * @param {any[]}                      args    Les paramètres de la
         *                                             méthode.
         * @param {ContextBefore<BrowserType>} context Le contexte du crochet.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "BrowserType.launch:before": (
            args,
            { obj: browserType, prop: functionName },
        ) => {
            return [
                changeUserAgentFromBrowserType(
                    args[0],
                    userAgent,
                    browserType,
                    functionName,
                ),
            ];
        },

        /**
         * Modifie les options de lancement du navigateur avec persistence.
         *
         * @param {any[]}                      args    Les paramètres de la
         *                                             méthode.
         * @param {ContextBefore<BrowserType>} context Le contexte du crochet.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "BrowserType.launchPersistentContext:before": (
            args,
            { obj: browserType, prop: functionName },
        ) => {
            return [
                args[0],
                changeUserAgentFromBrowserType(
                    args[1],
                    userAgent,
                    browserType,
                    functionName,
                ),
            ];
        },

        /**
         * Modifie les options de lancement du serveur.
         *
         * @param {any[]}                      args    Les paramètres de la
         *                                             méthode.
         * @param {ContextBefore<BrowserType>} context Le contexte du crochet.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "BrowserType.launchServer:before": (
            args,
            { obj: browserType, prop: functionName },
        ) => {
            return [
                changeUserAgentFromBrowserType(
                    args[0],
                    userAgent,
                    browserType,
                    functionName,
                ),
            ];
        },

        /**
         * Modifie les options de création d'un context.
         *
         * @param {any[]}                  args    Les paramètres de la méthode.
         * @param {ContextBefore<Browser>} context Le contexte du crochet.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "Browser.newContext:before": (args, { obj: browser }) => {
            return [changeUserAgentFromBrowser(args[0], userAgent, browser)];
        },

        /**
         * Modifie les options de création d'un contexte d'une page.
         *
         * @param {any[]}                  args    Les paramètres de la méthode.
         * @param {ContextBefore<Browser>} context Le contexte du crochet.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "Browser.newPage:before": (args, { obj: browser }) => {
            return [changeUserAgentFromBrowser(args[0], userAgent, browser)];
        },
    };
}

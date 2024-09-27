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
 * Modifie l'agent utilisateur (_user agent_) du navigateur.
 *
 * @param {Record<string, any>|undefined} options     Les options de création
 *                                                    d'un `Browser`.
 * @param {string}                        userAgent   L'agent utilisateur à
 *                                                    utiliser.
 * @param {BrowserType}                   browserType Le type de navigateur.
 * @returns {Record<string, any>|undefined} Les nouvelles options.
 */
const changeUserAgent = (options, userAgent, browserType) => {
    if ("chromium" === browserType.name()) {
        return {
            ...options,
            // Ne pas utiliser l'option "userAgent" des contextes, car elle ne
            // modifie pas l'agent utilisateur des workers.
            args: [`--user-agent=${userAgent}`, ...(options?.args ?? [])],
        };
    }
    return options;
};

/**
 * Crée un plugin pour changer l'agent utilisateur (_user agent_) du navigateur.
 *
 * @param {Object} options           Les options du plugin.
 * @param {string} options.userAgent Le _user agent_ à utiliser.
 * @see https://developer.mozilla.org/Web/HTTP/Headers/User-Agent
 */
export default function userAgentPlugin(options) {
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
        "BrowserType.launch:before": (args, { obj: browserType }) => {
            return [changeUserAgent(args[0], userAgent, browserType)];
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
            return [args[0], changeUserAgent(args[1], userAgent, browserType)];
        },
    };
}

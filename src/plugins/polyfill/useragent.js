/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @typedef {import("playwright").BrowserType} BrowserType
 */

/**
 * Modifie l'agent utilisateur (<em>user agent</em>) du navigateur.
 *
 * @param {Object}      [options]   Les options de création d'un
 *                                  <code>Browser</code>.
 * @param {string}      userAgent   L'agent utilisateur à utiliser.
 * @param {BrowserType} browserType Le type de navigateur.
 * @returns {Object|undefined} Les nouvelles options.
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
 * Crée un plugin pour changer l'agent utilisateur (<em>user agent</em>) du
 * navigateur.
 *
 * @param {Object} options           Les options du plugin.
 * @param {string} options.userAgent Le <em>user agent</em> à utiliser.
 * @see https://developer.mozilla.org/Web/HTTP/Headers/User-Agent
 */
export default function userAgentPlugin(options) {
    const userAgent = options.userAgent;

    return {
        "BrowserType.launch:before": (args, { obj: browserType }) => {
            return [changeUserAgent(args[0], userAgent, browserType)];
        },

        "BrowserType.launchPersistentContext:before": (
            args,
            { obj: browserType },
        ) => {
            return [args[0], changeUserAgent(args[1], userAgent, browserType)];
        },
    };
}

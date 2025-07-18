/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import humanizeRecommendedPlugins from "./humanize/recommended.js";
import polyfillRecommendedPlugins from "./polyfill/recommended.js";

/**
 * @import { HumanizeRecommendedOptions } from "./humanize/recommended.js"
 * @import { PolyfillRecommendedOptions } from "./polyfill/recommended.js"
 */

/**
 * Initialise des plugins sauf s'ils sont désactivés.
 *
 * @param {Function}       plugins   La fonction pour créer les plugins.
 * @param {Object|boolean} [options] Les éventuelles options des plugins ; ou un
 *                                   booléen pour activer / déactiver les
 *                                   plugins.
 * @returns {Record<string, Function>[]} Les crochets des plugins ; ou une liste
 *                                       vide si les plugins sont désactivés.
 */
const initPlugins = (plugins, options) => {
    return "boolean" === typeof options
        ? options
            ? plugins()
            : []
        : plugins(options);
};

/**
 * Crée les plugins recommandés.
 *
 * @param {Object}                             [options]          Les
 *                                                                éventuelles
 *                                                                options des
 *                                                                plugins
 *                                                                recommandés.
 * @param {PolyfillRecommendedOptions|boolean} [options.polyfill] Les
 *                                                                éventuelles
 *                                                                options des
 *                                                                plugins
 *                                                                gommant les
 *                                                                différences
 *                                                                entre un
 *                                                                navigateur
 *                                                                utilisé par un
 *                                                                être humain et
 *                                                                un navigateur
 *                                                                _headless_
 *                                                                contrôlé par
 *                                                                un programme ;
 *                                                                ou un booléen
 *                                                                pour activer /
 *                                                                désactiver les
 *                                                                plugins
 *                                                                _polyfill_.
 * @param {HumanizeRecommendedOptions|boolean} [options.humanize] Les
 *                                                                éventuelles
 *                                                                options des
 *                                                                plugins
 *                                                                humanisant ;
 *                                                                ou un booléen
 *                                                                pour activer /
 *                                                                désactiver les
 *                                                                plugins
 *                                                                _humanize_.
 * @returns {Record<string, Function>[]} Les crochets des plugins
 *                                       recommandés.
 */
export default function recommended(options) {
    return [
        ...initPlugins(polyfillRecommendedPlugins, options?.polyfill),
        ...initPlugins(humanizeRecommendedPlugins, options?.humanize),
    ];
}

/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import polyfillAutomationPlugin from "./automation.js";
import polyfillHeadlessPlugin from "./headless.js";
import polyfillScreenPlugin from "./screen.js";
import polyfillViewportPlugin from "./viewport.js";
import polyfillWebdriverPlugin from "./webdriver.js";

/**
 * @import { PolyfillScreenOptions } from "./screen.js"
 * @import { PolyfillViewportOptions } from "./viewport.js"
 */

/**
 * @typedef {Object} PolyfillRecommendedOptions Les options des plugins
 *                                              recommandés pour gommer les
 *                                              différences entre un navigateur
 *                                              utilisé par un être humain et un
 *                                              navigateur _headless_ contrôlé
 *                                              par un programme.
 * @prop {boolean}                         [automation] Un booléen pour
 *                                                      activer / désactiver le
 *                                                      plugin.
 * @prop {boolean}                         [headless]   Un booléen pour
 *                                                      activer / désactiver le
 *                                                      plugin.
 * @prop {PolyfillScreenOptions|boolean}   [screen]     Les éventuelles options
 *                                                      du plugin de la taille
 *                                                      de l'écran ; ou un
 *                                                      booléen pour activer /
 *                                                      déactiver le plugin.
 * @prop {PolyfillViewportOptions|boolean} [viewport]   Les éventuelles options
 *                                                      du plugin de la taille
 *                                                      de la fenêtre du
 *                                                      navigateur ; ou un
 *                                                      booléen pour activer /
 *                                                      désactiver le plugin.
 * @prop {boolean}                         [webdriver]  Un booléen pour
 *                                                      activer / désactiver le
 *                                                      plugin.
 */

/**
 * Initialise un plugin sauf s'il est désactivé.
 *
 * @param {Function}       plugin    La fonction pour créer le plugin.
 * @param {Object|boolean} [options] Les éventuelles options du plugin ; ou un
 *                                   booléen pour activer / déactiver le plugin.
 * @returns {Record<string, Function>} Les crochets du plugin ; ou un objet vide
 *                                     si le plugin est désactivé.
 */
const initPlugin = (plugin, options) => {
    return "boolean" === typeof options
        ? options
            ? plugin()
            : {}
        : plugin(options);
};

/**
 * Crée les plugins recommandés qui gomment les différences entre un
 * navigateur utilisé par un être humain et un navigateur _headless_
 * contrôlé par un programme.
 *
 * @param {PolyfillRecommendedOptions} [options] Les éventuelles options des
 *                                               plugins récommandés pour gommer
 *                                               les différences entre un
 *                                               navigateur utilisé par un être
 *                                               humain et un navigateur
 *                                               _headless_ contrôlé par un
 *                                               programme.
 * @returns {Record<string, Function>[]} Les crochets des plugins recommandés.
 */
export default function polyfillRecommendedPlugins(options) {
    return [
        initPlugin(polyfillAutomationPlugin, options?.automation),
        initPlugin(polyfillHeadlessPlugin, options?.headless),
        initPlugin(polyfillScreenPlugin, options?.screen),
        initPlugin(polyfillViewportPlugin, options?.viewport),
        initPlugin(polyfillWebdriverPlugin, options?.webdriver),
    ];
}

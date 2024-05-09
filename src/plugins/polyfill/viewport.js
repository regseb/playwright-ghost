/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import Random from "../../utils/random.js";

/**
 * Modifie la taille du navigateur.
 *
 * @param {Object} [options] Les options de création d'un
 *                           <code>BrowserContext</code>.
 * @param {number} width     La largeur du navigateur.
 * @param {number} height    La hauteur du navigateur.
 * @returns {Object|undefined} Les nouvelles options.
 */
const setViewport = function (options, width, height) {
    return {
        ...options,
        viewport: { width, height, ...options?.viewport },
    };
};

/**
 * Crée un plugin pour faire varier la taille du navigateur. Par défaut les
 * valeurs sont prises aléatoirement entre <em>1000x500</em> et
 * <em>1800x800</em>.
 *
 * @param {Object} [options]        Les options du plugin.
 * @param {number} [options.width]  La largeur du navigateur.
 * @param {number} [options.height] La hauteur du navigateur.
 */
export default function viewportPlugin(options) {
    const width = options?.width ?? Random.getInt(1000, 1800);
    const height = options?.height ?? Random.getInt(500, 800);

    return {
        "BrowserType.launchPersistentContext:before": (args) => {
            return [args[0], setViewport(args[1], width, height)];
        },

        "Browser.newContext:before": (args) => {
            return [setViewport(args[0], width, height)];
        },

        "Browser.newPage:before": (args) => {
            return [setViewport(args[0], width, height)];
        },
    };
}

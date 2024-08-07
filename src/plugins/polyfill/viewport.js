/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import Random from "../../utils/random.js";

/**
 * Modifie la taille du navigateur.
 *
 * @param {Record<string, any>|undefined} options Les options de création d'un
 *                                                <code>Browser</code>.
 * @param {number}                        width   La largeur du navigateur.
 * @param {number}                        height  La hauteur du navigateur.
 * @returns {Record<string, any>|undefined} Les nouvelles options.
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
        /**
         * Modifie les options de lancement du navigateur.
         *
         * @param {any[]} args Les paramètres de la méthode.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "BrowserType.launchPersistentContext:before": (args) => {
            return [args[0], setViewport(args[1], width, height)];
        },

        /**
         * Modifie les options de création d'un contexte.
         *
         * @param {any[]} args Les paramètres de la méthode.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "Browser.newContext:before": (args) => {
            return [setViewport(args[0], width, height)];
        },

        /**
         * Modifie les options de création d'une page.
         *
         * @param {any[]} args Les paramètres de la méthode.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "Browser.newPage:before": (args) => {
            return [setViewport(args[0], width, height)];
        },
    };
}

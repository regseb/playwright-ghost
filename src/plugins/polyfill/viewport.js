/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import Random from "../../utils/random.js";

/**
 * Modifie la taille de la zone d'affichage du navigateur.
 *
 * @param {Record<string, any>|undefined} options    Les options de création
 *                                                   d'un contexte ou d'une
 *                                                   page.
 * @param {Object}                        width      La largeur de la zone
 *                                                   d'affichage.
 * @param {number}                        width.min  La largeur minimum de la
 *                                                   zone d'affichage.
 * @param {number}                        width.max  La largeur maximum de la
 *                                                   zone d'affichage.
 * @param {Object}                        height     La hauteur de la zone
 *                                                   d'affichage.
 * @param {number}                        height.min La hauteur minimum de la
 *                                                   zone d'affichage.
 * @param {number}                        height.max La hauteur maximum de la
 *                                                   zone d'affichage.
 * @returns {Record<string, any>} Les nouvelles options.
 */
const setViewport = (options, width, height) => {
    return {
        ...options,
        viewport: {
            width: Random.int(width.min, width.max),
            height: Random.int(height.min, height.max),
            ...options?.viewport,
        },
    };
};

/**
 * @typedef {Object} PolyfillViewportOptions Les options du plugin
 *                                           `polyfill.viewport`.
 * @prop {Object} [width]      La largeur de la zone d'affichage.
 * @prop {number} [width.min]  La largeur minimum de la zone d'affichage.
 * @prop {number} [width.max]  La largeur maximum de la zone d'affichage.
 * @prop {Object} [height]     La hauteur de la zone d'affichage.
 * @prop {number} [height.min] La hauteur minimum de la zone d'affichage.
 * @prop {number} [height.max] La hauteur maximum de la zone d'affichage.
 */

/**
 * Crée un plugin pour faire varier la taille de la zone d'affichage du
 * navigateur. Par défaut les valeurs sont prises aléatoirement entre
 * _1000x500_ et _1800x800_.
 *
 * @param {PolyfillViewportOptions} [options] Les éventuelles options du plugin
 *                                            `polyfill.viewport`.
 * @returns {Record<string, Function>} Les crochets du plugin.
 */
export default function polyfillViewportPlugin(options) {
    const width = {
        min: options?.width?.min ?? 1000,
        max: options?.width?.max ?? 1800,
    };
    const height = {
        min: options?.height?.min ?? 500,
        max: options?.height?.max ?? 800,
    };

    return {
        /**
         * Modifie les options de lancement d'un contexte (et du navigateur).
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
         * Modifie les options de création d'un contexte d'une page.
         *
         * @param {any[]} args Les paramètres de la méthode.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "Browser.newPage:before": (args) => {
            return [setViewport(args[0], width, height)];
        },
    };
}

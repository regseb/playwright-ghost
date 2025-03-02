/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import crypto from "node:crypto";

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
const setViewport = function (options, width, height) {
    return {
        ...options,
        viewport: {
            width: crypto.randomInt(width.min, width.max + 1),
            height: crypto.randomInt(height.min, height.max + 1),
            ...options?.viewport,
        },
    };
};

/**
 * Crée un plugin pour faire varier la taille de la zone d'affichage du
 * navigateur. Par défaut les valeurs sont prises aléatoirement entre
 * _1000x500_ et _1800x800_.
 *
 * @param {Object} [options]            Les options du plugin.
 * @param {Object} [options.width]      La largeur de la zone d'affichage.
 * @param {number} [options.width.min]  La largeur minimum de la zone
 *                                      d'affichage.
 * @param {number} [options.width.max]  La largeur maximum de la zone
 *                                      d'affichage.
 * @param {Object} [options.height]     La hauteur de la zone d'affichage.
 * @param {number} [options.height.min] La hauteur minimum de la zone
 *                                      d'affichage.
 * @param {number} [options.height.max] La hauteur maximum de la zone
 *                                      d'affichage.
 * @returns {Record<string, Function>} Les crochets du plugin.
 */
export default function viewportPlugin(options) {
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
         * Modifie les options de création d'une page (et de son contexte).
         *
         * @param {any[]} args Les paramètres de la méthode.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "Browser.newPage:before": (args) => {
            return [setViewport(args[0], width, height)];
        },
    };
}

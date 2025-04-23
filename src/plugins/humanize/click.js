/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import crypto from "node:crypto";

/**
 * Ajoute un délai entre le `mousedown` et `mouseup` d'un clic.
 *
 * @param {Record<string, any>|undefined} options   Les options du clic.
 * @param {Object}                        delay     Le délai.
 * @param {number}                        delay.min Le délai minimum en
 *                                                  millisecondes.
 * @param {number}                        delay.max Le délai maximum en
 *                                                  millisecondes.
 * @returns {Record<string, any>} Les nouvelles options.
 */
const setDelay = function (options, delay) {
    return {
        ...options,
        delay: options?.delay ?? crypto.randomInt(delay.min, delay.max + 1),
    };
};

/**
 * @typedef {Object} ClickOptions Les options du plugin `humanize.click`.
 * @prop {Object} [delay]     Le délai entre `mousedown` et `mouseup`.
 * @prop {number} [delay.min] Le délai minimum en millisecondes.
 * @prop {number} [delay.max] Le délai maximum en millisecondes.
 */

/**
 * Crée un plugin pour humaniser les clics.
 *
 * @param {ClickOptions} [options] Les éventuelles options du plugin
 *                                 `humanize.click`.
 * @returns {Record<string, Function>} Les crochets du plugin.
 */
export default function clickPlugin(options) {
    const delay = {
        min: options?.delay?.min ?? 100,
        max: options?.delay?.max ?? 500,
    };

    return {
        /**
         * Ajoute du délai dans les options du clic.
         *
         * @param {any[]} args Les paramètres de la méthode.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "Locator.click:before": (args) => {
            return [setDelay(args[0], delay)];
        },

        /**
         * Ajoute du délai dans les options du double-clic.
         *
         * @param {any[]} args Les paramètres de la méthode.
         * @returns {any[]} Les nouveaux paramètres.
         */
        "Locator.dblclick:before": (args) => {
            return [setDelay(args[0], delay)];
        },
    };
}

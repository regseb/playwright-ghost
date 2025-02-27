/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import crypto from "node:crypto";
import timers from "node:timers/promises";

/**
 * @import { Page } from "playwright"
 */

/**
 * Crée un plugin pour fermer les boîtes de dialogues dans un temps humainement
 * possible. Par défaut le temps d'attente est pris aléatoirement entre `1` et
 * `5` secondes.
 *
 * @param {Object} [options]           Les options du plugin.
 * @param {Object} [options.delay]     Le délai avant la fermeture.
 * @param {number} [options.delay.min] Le délai minimum en millisecondes.
 * @param {number} [options.delay.max] Le délai maximum en millisecondes.
 * @returns {Record<string, Function>} Le crochet du plugin.
 */
export default function dialogPlugin(options) {
    const delay = {
        min: options?.delay?.min ?? 1000,
        max: options?.delay?.max ?? 5000,
    };

    return {
        /**
         * Ajoute un écouteur à l'ouverture d'une boite de dialogue.
         *
         * @param {Page} page La page nouvellement créée.
         * @returns {Page} La page avec l'écouteur.
         */
        "Page:new": (page) => {
            page.on("dialog", async (dialog) => {
                await timers.setTimeout(crypto.randomInt(delay.min, delay.max));
                await dialog.accept();
            });
            return page;
        },
    };
}

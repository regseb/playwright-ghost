/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @import { Page } from "playwright"
 */

import Random from "../../utils/random.js";
import wait from "../../utils/wait.js";

/**
 * Crée un plugin pour fermer les boîtes de dialogues dans un temps humainement
 * possible. Par défaut le temps d'attente est pris aléatoirement entre `1` et
 * `5` secondes.
 *
 * @param {Object} [options]             Les options du plugin.
 * @param {Object} [options.timeout]     Le temps d'attente.
 * @param {number} [options.timeout.min] Le temps d'attente minimal en
 *                                       millisecondes.
 * @param {number} [options.timeout.max] Le temps d'attente maximal en
 *                                       millisecondes.
 * @returns {Record<string, Function>} Le crochet du plugin.
 */
export default function dialogPlugin(options) {
    const timeout = {
        min: options?.timeout?.min ?? 1000,
        max: options?.timeout?.max ?? 5000,
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
                await wait(Random.getInt(timeout.min, timeout.max));
                await dialog.accept();
            });
            return page;
        },
    };
}

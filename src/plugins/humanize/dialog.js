/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import Random from "../../utils/random.js";
import wait from "../../utils/wait.js";

/**
 * Crée un plugin pour fermer les boîtes de dialogues dans un temps humainement
 * possible. Par défaut le temps d'attente est pris aléatoirement entre `1` et
 * `5` secondes.
 *
 * @param {Object} [options]     Les options du plugin.
 * @param {number} [options.min] Le temps d'attente minimal en millisecondes.
 * @param {number} [options.max] Le temps d'attente maximal en millisecondes.
 */
export default function dialogPlugin(options) {
    const min = options?.min ?? 1000;
    const max = options?.max ?? 5000;

    return {
        "Page:new": (page) => {
            page.on("dialog", async (dialog) => {
                await wait(Random.getInt(min, max));
                await dialog.accept();
            });
            return page;
        },
    };
}

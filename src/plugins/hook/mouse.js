/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../../hook.js";

/**
 * @import { Mouse } from "playwright"
 * @import { ContextAfter } from "../../hook.js"
 */

/**
 * Crée un plugin pour ajouter des écouteurs dans les objets `Mouse`.
 *
 * @returns {Record<string, Function>} Le crochet du plugin.
 * @see https://playwright.dev/docs/api/class-mouse
 */
export default function mousePlugin() {
    return {
        /**
         * Ajoute les plugins dans la souris d'une nouvelle page.
         *
         * @param {Mouse}             mouse   La souris de la page nouvellement
         *                                    créée.
         * @param {ContextAfter<any>} context Le contexte du crochet.
         * @returns {Mouse} La souris avec les plugins.
         */
        "Mouse:new": (mouse, { metadata: { listeners } }) => {
            return listeners.has("Mouse")
                ? hook(mouse, listeners.get("Mouse"), { listeners })
                : mouse;
        },
    };
}

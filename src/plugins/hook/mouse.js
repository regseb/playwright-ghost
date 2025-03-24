/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../../hook.js";

/**
 * @import { Mouse } from "playwright"
 * @import { Listener } from "../../hook.js"
 */

/**
 * Crée un plugin pour ajouter des écouteurs dans les objets `Mouse`.
 *
 * @param {Map<string, Map<string, Listener>>} listeners Les écouteurs regroupés
 *                                                       par objet, propriété et
 *                                                       temporalité.
 * @returns {Record<string, Function>} Le crochet du plugin.
 * @see https://playwright.dev/docs/api/class-mouse
 */
export default function mousePlugin(listeners) {
    return {
        /**
         * Ajoute les plugins dans la souris d'une nouvelle page.
         *
         * @param {Mouse} mouse La souris de la page nouvellement créée.
         * @returns {Mouse} La souris avec les plugins.
         */
        "Mouse:new": (mouse) => {
            return listeners.has("Mouse")
                ? hook(mouse, listeners.get("Mouse"))
                : mouse;
        },
    };
}

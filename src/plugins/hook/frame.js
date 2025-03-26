/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../../hook.js";

/**
 * @import { Frame } from "playwright"
 * @import { Listener } from "../../hook.js"
 */

/**
 * Crée un plugin pour ajouter des écouteurs dans les objets `Frame`.
 *
 * @param {Map<string, Map<string, Listener>>} listeners Les écouteurs regroupés
 *                                                       par objet, propriété et
 *                                                       temporalité.
 * @returns {Record<string, Function>} Le crochet du plugin.
 * @see https://playwright.dev/docs/api/class-frame
 */
export default function framePlugin(listeners) {
    return {
        /**
         * Ajoute les plugins dans une nouvelle `Frame`.
         *
         * @param {Frame} frame La `Frame` nouvellement créée.
         * @returns {Frame} La `Frame` avec les plugins.
         */
        "Frame:new": (frame) => {
            return listeners.has("Frame")
                ? hook(frame, listeners.get("Frame"))
                : frame;
        },
    };
}

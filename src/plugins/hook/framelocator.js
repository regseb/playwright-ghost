/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../../hook.js";

/**
 * @import { FrameLocator } from "playwright"
 * @import { Listener } from "../../hook.js"
 */

/**
 * Crée un plugin pour ajouter des écouteurs dans les objets `FrameLocator`.
 *
 * @param {Map<string, Map<string, Listener>>} listeners Les écouteurs regroupés
 *                                                       par objet, propriété et
 *                                                       temporalité.
 * @returns {Record<string, Function>} Le crochet du plugin.
 * @see https://playwright.dev/docs/api/class-framelocator
 */
export default function frameLocatorPlugin(listeners) {
    return {
        /**
         * Ajoute les plugins dans un nouveau `FrameLocator`.
         *
         * @param {FrameLocator} frameLocator Le `FrameLocator` nouvellement
         *                                    créé.
         * @returns {FrameLocator} Le `FrameLocator` avec les plugins.
         */
        "FrameLocator:new": (frameLocator) => {
            return listeners.has("FrameLocator")
                ? hook(frameLocator, listeners.get("FrameLocator"))
                : frameLocator;
        },
    };
}

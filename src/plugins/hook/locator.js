/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../../hook.js";

/**
 * @import { Locator } from "playwright"
 * @import { Listener } from "../../hook.js"
 */

/**
 * Crée un plugin pour ajouter des écouteurs dans les objets `Locator`.
 *
 * @param {Map<string, Map<string, Listener>>} listeners Les écouteurs regroupés
 *                                                       par objet, propriété et
 *                                                       temporalité.
 * @returns {Record<string, Function>} Le crochet du plugin.
 * @see https://playwright.dev/docs/api/class-locator
 */
export default function locatorPlugin(listeners) {
    return {
        /**
         * Ajoute les plugins dans un nouveau `Locator`.
         *
         * @param {Locator} locator Le `Locator` nouvellement créé.
         * @returns {Locator} Le `Locator` avec les plugins.
         */
        "Locator:new": (locator) => {
            return listeners.has("Locator")
                ? hook(locator, listeners.get("Locator"))
                : locator;
        },
    };
}

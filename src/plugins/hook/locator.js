/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../../hook.js";

/**
 * @import { Locator } from "playwright"
 * @import { ContextAfter } from "../../hook.js"
 */

/**
 * Crée un plugin pour ajouter des écouteurs dans les objets `Locator`.
 *
 * @returns {Record<string, Function>} Le crochet du plugin.
 * @see https://playwright.dev/docs/api/class-locator
 */
export default function locatorPlugin() {
    return {
        /**
         * Ajoute les plugins dans un nouveau `Locator`.
         *
         * @param {Locator}           locator Le `Locator` nouvellement créé.
         * @param {ContextAfter<any>} context Le contexte du crochet.
         * @returns {Locator} Le `Locator` avec les plugins.
         */
        "Locator:new": (locator, { metadata: { listeners } }) => {
            return listeners.has("Locator")
                ? hook(locator, listeners.get("Locator"), { listeners })
                : locator;
        },
    };
}

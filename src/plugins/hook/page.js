/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../../hook.js";

/**
 * @import { Page } from "playwright"
 * @import { Listener } from "../../hook.js"
 */

/**
 * Crée un plugin pour ajouter des écouteurs dans les objets `Page`.
 *
 * @param {Map<string, Map<string, Listener>>} listeners Les écouteurs regroupés
 *                                                       par objet, propriété et
 *                                                       temporalité.
 * @returns {Record<string, Function>} Le crochet du plugin.
 * @see https://playwright.dev/docs/api/class-page
 */
export default function pagePlugin(listeners) {
    return {
        /**
         * Ajoute les plugins dans une nouvelle page.
         *
         * @param {Page} page La page nouvellement créée.
         * @returns {Page} La page avec les plugins.
         */
        "Page:new": (page) => {
            return listeners.has("Page")
                ? hook(page, listeners.get("Page"))
                : page;
        },
    };
}

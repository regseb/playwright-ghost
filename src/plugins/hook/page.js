/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../../hook.js";

/**
 * @import { Page } from "playwright"
 * @import { ContextAfter } from "../../hook.js"
 */

/**
 * Crée un plugin pour ajouter des écouteurs dans les objets `Page`.
 *
 * @returns {Record<string, Function>} Le crochet du plugin.
 * @see https://playwright.dev/docs/api/class-page
 */
export default function pagePlugin() {
    return {
        /**
         * Ajoute les plugins dans une nouvelle page.
         *
         * @param {Page}              page    La page nouvellement créée.
         * @param {ContextAfter<any>} context Le contexte du crochet.
         * @returns {Page} La page avec les plugins.
         */
        "Page:new": (page, { metadata: { listeners } }) => {
            return listeners.has("Page")
                ? hook(page, listeners.get("Page"), { listeners })
                : page;
        },
    };
}

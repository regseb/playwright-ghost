/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../../hook.js";

/**
 * Crée un plugin pour ajouter des écouteurs dans les objets `Page`.
 *
 * @returns {Record<string, Function>} Le crochet du plugin.
 * @see https://playwright.dev/docs/api/class-page
 */
export default function pagePlugin() {
    return {
        "Page:new": (page, { metadata: { listeners } }) => {
            return listeners.has("Page")
                ? hook(page, listeners.get("Page"), { listeners })
                : page;
        },
    };
}

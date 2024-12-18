/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../../hook.js";

/**
 * Crée un plugin pour ajouter des écouteurs dans les objets `Browser`.
 *
 * @returns {Record<string, Function>} Le crochet du plugin.
 * @see https://playwright.dev/docs/api/class-browser
 */
export default function browserPlugin() {
    return {
        "Browser:new": (browser, { metadata: { listeners } }) => {
            return listeners.has("Browser")
                ? hook(browser, listeners.get("Browser"), { listeners })
                : browser;
        },
    };
}

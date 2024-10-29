/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../../hook.js";

/**
 * Crée un plugin pour ajouter des écouteurs dans les objets `BrowserContext`.
 *
 * @returns {Record<string, Function>} Le crochet du plugin.
 * @see https://playwright.dev/docs/api/class-browsercontext
 */
export default function browserContextPlugin() {
    return {
        "BrowserContext:new": (context, { metadata: { listeners } }) => {
            return listeners.has("BrowserContext")
                ? hook(context, listeners.get("BrowserContext"), { listeners })
                : context;
        },
    };
}

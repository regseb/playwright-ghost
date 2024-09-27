/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../../hook.js";

/**
 * Crée un plugin pour ajouter des écouteurs dans les objets `Page`.
 *
 * @see https://playwright.dev/docs/api/class-locator
 */
export default function locatorPlugin() {
    return {
        "Locator:new": (page, { metadata: { listeners } }) => {
            return listeners.has("Locator")
                ? hook(page, listeners.get("Locator"), { listeners })
                : page;
        },
    };
}

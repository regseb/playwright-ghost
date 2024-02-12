/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../../hook.js";

/**
 * @typedef {import("playwright").Locator} Locator
 */

/**
 * Crée un plugin pour ajouter des écouteurs dans les objets <code>Page</code>.
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

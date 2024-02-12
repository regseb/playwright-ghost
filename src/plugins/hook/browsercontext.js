/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../../hook.js";

/**
 * @typedef {import("playwright").BrowserContext} BrowserContext
 */

/**
 * Crée un plugin pour ajouter des écouteurs dans les objets
 * <code>BrowserContext</code>.
 *
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

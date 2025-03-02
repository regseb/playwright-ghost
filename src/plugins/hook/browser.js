/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../../hook.js";

/**
 * @import { Browser } from "playwright"
 * @import { ContextAfter } from "../../hook.js"
 */

/**
 * Crée un plugin pour ajouter des écouteurs dans les objets `Browser`.
 *
 * @returns {Record<string, Function>} Le crochet du plugin.
 * @see https://playwright.dev/docs/api/class-browser
 */
export default function browserPlugin() {
    return {
        /**
         * Ajoute les plugins dans un nouveau navigateur.
         *
         * @param {Browser}           browser Le navigateur nouvellement créé.
         * @param {ContextAfter<any>} context Le contexte du crochet.
         * @returns {Browser} Le navigateur avec les plugins.
         */
        "Browser:new": (browser, { metadata: { listeners } }) => {
            return listeners.has("Browser")
                ? hook(browser, listeners.get("Browser"), { listeners })
                : browser;
        },
    };
}

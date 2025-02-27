/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../../hook.js";

/**
 * @import { BrowserContext } from "playwright"
 * @import { ContextAfter } from "../../hook.js"
 */

/**
 * Crée un plugin pour ajouter des écouteurs dans les objets `BrowserContext`.
 *
 * @returns {Record<string, Function>} Le crochet du plugin.
 * @see https://playwright.dev/docs/api/class-browsercontext
 */
export default function browserContextPlugin() {
    return {
        /**
         * Ajoute les plugins dans un nouveau contexte de navigateur.
         *
         * @param {BrowserContext}    browserContext Le contexte du navigateur
         *                                           nouvellement créé.
         * @param {ContextAfter<any>} context        Le contexte du crochet.
         * @returns {BrowserContext} Le contexte du navigateur avec les plugins.
         */
        "BrowserContext:new": (browserContext, { metadata: { listeners } }) => {
            return listeners.has("BrowserContext")
                ? hook(browserContext, listeners.get("BrowserContext"), {
                      listeners,
                  })
                : browserContext;
        },
    };
}

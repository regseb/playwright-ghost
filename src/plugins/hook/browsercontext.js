/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../../hook.js";

/**
 * @import { BrowserContext } from "playwright"
 * @import { Listener } from "../../hook.js"
 */

/**
 * Crée un plugin pour ajouter des écouteurs dans les objets `BrowserContext`.
 *
 * @param {Map<string, Map<string, Listener>>} listeners Les écouteurs regroupés
 *                                                       par objet, propriété et
 *                                                       temporalité.
 * @returns {Record<string, Function>} Le crochet du plugin.
 * @see https://playwright.dev/docs/api/class-browsercontext
 */
export default function browserContextPlugin(listeners) {
    return {
        /**
         * Ajoute les plugins dans un nouveau contexte de navigateur.
         *
         * @param {BrowserContext} browserContext Le contexte du navigateur
         *                                        nouvellement créé.
         * @returns {BrowserContext} Le contexte du navigateur avec les plugins.
         */
        "BrowserContext:new": (browserContext) => {
            return listeners.has("BrowserContext")
                ? hook(browserContext, listeners.get("BrowserContext"))
                : browserContext;
        },
    };
}

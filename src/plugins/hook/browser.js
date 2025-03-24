/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../../hook.js";

/**
 * @import { Browser } from "playwright"
 * @import { Listener } from "../../hook.js"
 */

/**
 * Crée un plugin pour ajouter des écouteurs dans les objets `Browser`.
 *
 * @param {Map<string, Map<string, Listener>>} listeners Les écouteurs regroupés
 *                                                       par objet, propriété et
 *                                                       temporalité.
 * @returns {Record<string, Function>} Le crochet du plugin.
 * @see https://playwright.dev/docs/api/class-browser
 */
export default function browserPlugin(listeners) {
    return {
        /**
         * Ajoute les plugins dans un nouveau navigateur.
         *
         * @param {Browser} browser Le navigateur nouvellement créé.
         * @returns {Browser} Le navigateur avec les plugins.
         */
        "Browser:new": (browser) => {
            return listeners.has("Browser")
                ? hook(browser, listeners.get("Browser"))
                : browser;
        },
    };
}

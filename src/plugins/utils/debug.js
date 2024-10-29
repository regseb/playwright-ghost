/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @import { Page } from "playwright"
 */

/**
 * Crée un plugin pour transférer les messages de la console du navigateur dans
 * la console de Playwright-ghost.
 *
 * @returns {Record<string, Function>} Le crochet du plugin.
 */
export default function debugPlugin() {
    return {
        /**
         * Ajoute des écouteurs aux évènements `console` et `pageerror` de la
         * page.
         *
         * @param {Page} page La page nouvellement créée.
         * @returns {Page} La page avec les écouteurs.
         */
        "Page:new": (page) => {
            // eslint-disable-next-line no-console
            page.on("console", (m) => console.log(m));
            // eslint-disable-next-line no-console
            page.on("pageerror", (e) => console.error(e));
            return page;
        },
    };
}

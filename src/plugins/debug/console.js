/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @import { Page } from "playwright"
 */

/**
 * @typedef {Object} DebugConsoleOptions Les options du plugin `debug.console`.
 * @prop {boolean} [console]   La marque indiquant si les messages de la console
 *                             du navigateur sont transférés dans la console de
 *                             Playwright-ghost. `true` par défaut.
 * @prop {boolean} [pageError] La marque indiquant si les erreurs du navigateur
 *                             sont transférées dans la console de
 *                             Playwright-ghost. `true` par défaut.
 */

/**
 * Crée un plugin pour transférer les messages de la console du navigateur dans
 * la console de Playwright-ghost.
 *
 * @param {DebugConsoleOptions} [options] Les éventuelles options du plugin
 *                                        `debug.console`.
 * @returns {Record<string, Function>} Le crochet du plugin.
 * @see https://playwright.dev/docs/api/class-page#page-event-console
 * @see https://playwright.dev/docs/api/class-page#page-event-page-error
 */
export default function debugConsolePlugin(options) {
    const listenConsole = options?.console ?? true;
    const listenPageError = options?.pageError ?? true;

    return {
        /**
         * Ajoute des écouteurs aux évènements `console` et `pageerror` de la
         * page.
         *
         * @param {Page} page La page nouvellement créée.
         * @returns {Page} La page avec les écouteurs.
         */
        "Page:new": (page) => {
            if (listenConsole) {
                // eslint-disable-next-line no-console
                page.on("console", (m) => console.log(m));
            }

            if (listenPageError) {
                // eslint-disable-next-line no-console
                page.on("pageerror", (e) => console.error(e));
            }

            return page;
        },
    };
}

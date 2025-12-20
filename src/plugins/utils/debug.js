/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @import { Page } from "playwright"
 */

/**
 * @typedef {Object} UtilsDebugOptions Les options du plugin `utils.debug`.
 * @prop {boolean} [console]   La marque indiquant si les messages de la console
 *                             du navigateur sont transférés dans la console de
 *                             Playwright-ghost. `true` par défaut.
 * @prop {boolean} [pageerror] La marque indiquant si les erreurs du navigateur
 *                             sont transférées dans la console de
 *                             Playwright-ghost. `true` par défaut.
 * @prop {boolean} [cursor]    La marque indiquant si le curseur est affiché
 *                             dans la page. `true` par défaut.
 * @deprecated Since version 0.16.0, debugging plugins are located in `debug`
 *             (`debug.console`, `debug.cursor`).
 */

/**
 * Crée un plugin pour ajouter du débogage dans une page.
 *
 * @param {UtilsDebugOptions} [options] Les éventuelles options du plugin
 *                                      `utils.debug`.
 * @returns {Record<string, Function>} Le crochet du plugin.
 * @deprecated Since version 0.16.0, debugging plugins are located in `debug`
 *             (`debug.console`, `debug.cursor`).
 */
export default function utilsDebugPlugin(options) {
    const debugConsole = options?.console ?? true;
    const debugPageerror = options?.pageerror ?? true;
    const debugCursor = options?.cursor ?? true;

    return {
        /**
         * Ajoute du débogage dans la page.
         *
         * @param {Page} page La page nouvellement créée.
         * @returns {Promise<Page>} Une promesse contenant la page avec le
         *                          débogage.
         */
        "Page:new": async (page) => {
            if (debugConsole) {
                // eslint-disable-next-line no-console
                page.on("console", (m) => console.log(m));
            }

            if (debugPageerror) {
                // eslint-disable-next-line no-console
                page.on("pageerror", (e) => console.error(e));
            }

            if (debugCursor) {
                await page.addInitScript(() => {
                    /* eslint-disable no-undef */
                    document.addEventListener("DOMContentLoaded", () => {
                        const cursor = document.createElement("div");
                        cursor.style.backgroundColor = "black";
                        cursor.style.border = "2px solid white";
                        cursor.style.borderRadius = "50%";
                        cursor.style.height = "24px";
                        cursor.style.opacity = "50%";
                        // Ignorer les événements du curseur pour ne pas bloquer
                        // les interactions avec les éléments sous le div.
                        cursor.style.pointerEvents = "none";
                        cursor.style.position = "fixed";
                        cursor.style.transform = "translate(-50%, -50%)";
                        cursor.style.transition =
                            "width 0.1s ease-out, height 0.1s ease-out";
                        cursor.style.width = "24px";
                        cursor.style.zIndex = "2147483647";

                        document.addEventListener("mousemove", (event) => {
                            cursor.style.left = `${event.pageX}px`;
                            cursor.style.top = `${event.pageY}px`;
                        });
                        document.addEventListener("mousedown", () => {
                            cursor.style.height = "48px";
                            cursor.style.width = "48px";
                        });
                        document.addEventListener("mouseup", () => {
                            cursor.style.height = "24px";
                            cursor.style.width = "24px";
                        });
                        document.body.appendChild(cursor);
                    });
                    /* eslint-enable no-undef */
                });
            }

            return page;
        },
    };
}

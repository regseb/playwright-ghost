/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * Crée un plugin pour transférer les messages de la console du navigateur dans
 * la console de Playwright-ghost.
 */
export default function debugPlugin() {
    return {
        "Page:new": (page) => {
            // eslint-disable-next-line no-console
            page.on("console", (m) => console.log(m));
            // eslint-disable-next-line no-console
            page.on("pageerror", (e) => console.error(e));
            return page;
        },
    };
}

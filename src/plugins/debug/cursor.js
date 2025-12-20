/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @import { Page } from "playwright"
 */

/**
 * Crée un script pour afficher le curseur dans le navigateur. Cette fonction
 * est exécutée dans le navigateur.
 */
const initScript = () => {
    /* eslint-disable no-undef */
    document.addEventListener("DOMContentLoaded", () => {
        const cursor = document.createElement("div");
        cursor.style.backgroundColor = "black";
        cursor.style.border = "2px solid white";
        cursor.style.borderRadius = "50%";
        cursor.style.height = "24px";
        cursor.style.opacity = "50%";
        // Ignorer les événements du curseur pour ne pas bloquer les
        // interactions avec les éléments sous le div.
        cursor.style.pointerEvents = "none";
        cursor.style.position = "fixed";
        cursor.style.transform = "translate(-50%, -50%)";
        cursor.style.transition = "width 0.1s ease-out, height 0.1s ease-out";
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
};

/**
 * Crée un plugin pour afficher le curseur.
 *
 * @returns {Record<string, Function>} Le crochet du plugin.
 */
export default function debugCursorPlugin() {
    return {
        /**
         * Ajoute un script qui affiche le curseur.
         *
         * @param {Page} page La page nouvellement créée.
         * @returns {Promise<Page>} Une promesse contenant la page avec le
         *                          script.
         */
        "Page:new": async (page) => {
            // Ajouter le init script dans la page et non dans le contexte, car
            // il est possible de créer une page "sans" contexte (cf.
            // Browser.newPage()).
            await page.addInitScript(initScript);
            return page;
        },
    };
}

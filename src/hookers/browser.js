/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import Hooker from "./hooker.js";

/**
 * @import { Listener } from "../hook.js"
 * @import { Pointers } from "./hooker.js"
 */

/**
 * Pointeurs vers les méthodes créant ou récupérant un `Browser`.
 *
 * @type {Pointers}
 */
const POINTERS = {
    create: ["BrowserType.launch:after"],
    getter: ["BrowserContext.browser:after"],
};

/**
 * Crocheteur pour ajouter des écouteurs dans les objets `Browser`.
 *
 * @see https://playwright.dev/docs/api/class-browser
 */
export default class BrowserHooker extends Hooker {
    /**
     * Crochets pour écouter toutes les créations d'un `Browser`.
     *
     * @type {Record<string, Function>}
     */
    static PRESETS = Hooker.presets(POINTERS.create);

    /**
     * Crée un crocheteur pour les `Browser`.
     *
     * @param {Map<string, Map<string, Listener>>} listeners Les écouteurs
     *                                                       regroupés par
     *                                                       objet, propriété et
     *                                                       temporalité.
     */
    constructor(listeners) {
        super(POINTERS, listeners);
    }
}

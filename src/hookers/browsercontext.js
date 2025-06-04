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
 * Pointeurs vers les méthodes créant ou récupérant un `BrowserContext`.
 *
 * @type {Pointers}
 */
const POINTERS = {
    create: [
        "BrowserType.launchPersistentContext:after",
        "Browser.newContext:after",
    ],
    getter: ["Browser.contexts:after", "Page.context:after"],
};

/**
 * Crocheteur pour ajouter des écouteurs dans les objets `BrowserContext`.
 *
 * @see https://playwright.dev/docs/api/class-browsercontext
 */
export default class BrowserContextHooker extends Hooker {
    /**
     * Crochets pour écouter toutes les créations d'un `BrowserContext`.
     *
     * @type {Record<string, Function>}
     */
    static PRESETS = Hooker.presets(POINTERS.create);

    /**
     * Crée un crocheteur pour les `BrowserContext`.
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

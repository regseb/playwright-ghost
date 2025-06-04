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
 * Pointeurs vers les méthodes créant ou récupérant un `FrameLocator`.
 *
 * @type {Pointers}
 */
const POINTERS = {
    create: [
        "Page.frameLocator:after",
        "Locator.contentFrame:after",
        "Locator.frameLocator:after",
        "FrameLocator.frameLocator:after",
    ],
    getter: [],
};

/**
 * Crocheteur pour ajouter des écouteurs dans les objets `FrameLocator`.
 *
 * @see https://playwright.dev/docs/api/class-framelocator
 */
export default class FrameLocatorHooker extends Hooker {
    /**
     * Crochets pour écouter toutes les créations d'un `FrameLocator`.
     *
     * @type {Record<string, Function>}
     */
    static PRESETS = Hooker.presets(POINTERS.create);

    /**
     * Crée un crocheteur pour les `FrameLocator`.
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

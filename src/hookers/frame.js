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
 * Pointeurs vers les méthodes créant ou récupérant un `Frame`.
 *
 * @type {Pointers}
 */
const POINTERS = {
    create: ["Page.mainFrame:after", "Page.childFrames:after"],
    getter: [],
};

/**
 * Crocheteur pour ajouter des écouteurs dans les objets `Frame`.
 *
 * @see https://playwright.dev/docs/api/class-frame
 */
export default class FrameHooker extends Hooker {
    /**
     * Crochets pour écouter toutes les créations d'un `Frame`.
     *
     * @type {Record<string, Function>}
     */
    static PRESETS = Hooker.presets(POINTERS.create);

    /**
     * Crée un crocheteur pour les `Frame`.
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

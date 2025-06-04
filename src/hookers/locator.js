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
 * Pointeurs vers les méthodes créant ou récupérant un `Locator`.
 *
 * @type {Pointers}
 */
const POINTERS = {
    create: [
        "Page.getByAltText:after",
        "Page.getByLabel:after",
        "Page.getByPlaceholder:after",
        "Page.getByRole:after",
        "Page.getByTestId:after",
        "Page.getByText:after",
        "Page.getByTitle:after",
        "Page.locator:after",
        "Frame.getByAltText:after",
        "Frame.getByLabel:after",
        "Frame.getByPlaceholder:after",
        "Frame.getByRole:after",
        "Frame.getByTestId:after",
        "Frame.getByText:after",
        "Frame.getByTitle:after",
        "Frame.locator:after",
        "Locator.all:after",
        "Locator.and:after",
        "Locator.filter:after",
        "Locator.first:after",
        "Locator.getByAltText:after",
        "Locator.getByLabel:after",
        "Locator.getByPlaceholder:after",
        "Locator.getByRole:after",
        "Locator.getByTestId:after",
        "Locator.getByText:after",
        "Locator.getByTitle:after",
        "Locator.last:after",
        "Locator.locator:after",
        "Locator.nth:after",
        "Locator.or:after",
        "FrameLocator.getByAltText:after",
        "FrameLocator.getByLabel:after",
        "FrameLocator.getByPlaceholder:after",
        "FrameLocator.getByRole:after",
        "FrameLocator.getByTestId:after",
        "FrameLocator.getByText:after",
        "FrameLocator.getByTitle:after",
        "FrameLocator.locator:after",
    ],
    getter: [],
};

/**
 * Crocheteur pour ajouter des écouteurs dans les objets `Locator`.
 *
 * @see https://playwright.dev/docs/api/class-locator
 */
export default class LocatorHooker extends Hooker {
    /**
     * Crochets pour écouter toutes les créations d'un `Locator`.
     *
     * @type {Record<string, Function>}
     */
    static PRESETS = Hooker.presets(POINTERS.create);

    /**
     * Crée un crocheteur pour les `Locator`.
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

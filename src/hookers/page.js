/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import Hooker from "./hooker.js";

/**
 * @import { BrowserContext, BrowserType } from "playwright"
 * @import { ContextAfter, Listener } from "../hook.js"
 * @import { Pointers } from "./hooker.js"
 */

/**
 * Symbol où sera stocké temporairement l'objet crocheté.
 *
 * @type {symbol}
 */
const HOOKED_SYMBOL = Symbol("HOOKED");

/**
 * Pointeurs vers les méthodes créant ou récupérant une `Page`.
 *
 * @type {Pointers}
 */
const POINTERS = {
    create: ["Browser.newPage:after", "BrowserContext.newPage:after"],
    getter: [
        "BrowserContext.pages:after",
        "Locator.page:after",
        "Frame.page:after",
    ],
};

/**
 * Crocheteur pour ajouter des écouteurs dans les objets `Page`.
 *
 * @see https://playwright.dev/docs/api/class-page
 */
export default class PageHooker extends Hooker {
    /**
     * Crochets pour écouter toutes les créations d'une `Page`.
     *
     * @type {Record<string, Function>}
     */
    static PRESETS = {
        ...Hooker.presets(POINTERS.create),

        "BrowserType.launchPersistentContext:after":
            (/** @type {Function} */ listener) =>
            (
                /** @type {BrowserContext} */ browserContext,
                /** @type {ContextAfter<BrowserType>} */ context,
            ) => {
                // eslint-disable-next-line no-param-reassign
                browserContext[HOOKED_SYMBOL] = Hooker.modify(listener)(
                    browserContext[HOOKED_SYMBOL],
                    context,
                );
                return browserContext;
            },
    };

    /**
     * Crée un crocheteur pour les `Page`.
     *
     * @param {Map<string, Map<string, Listener>>} listeners Les écouteurs
     *                                                       regroupés par
     *                                                       objet, propriété et
     *                                                       temporalité.
     */
    constructor(listeners) {
        super(POINTERS, listeners);
    }

    first() {
        return {
            ...super.first(),

            /**
             * Prépare le crochetage de la `Page` par défaut d'un
             * `BrowserContext`.
             *
             * @param {BrowserContext} browserContext Le `BrowserContext` créé.
             * @returns {BrowserContext} Le `BrowserContext` avec la `Page` prête.
             */
            "BrowserType.launchPersistentContext:after": (browserContext) => {
                // eslint-disable-next-line no-param-reassign
                browserContext[HOOKED_SYMBOL] = super.prepare(
                    browserContext.pages(),
                );
                return browserContext;
            },
        };
    }

    last() {
        return {
            ...super.last(),

            /**
             * Finalise le crochetage de la `Page` par défaut d'un
             * `BrowserContext`.
             *
             * @param {BrowserContext} browserContext Le `BrowserContext` créé.
             * @returns {BrowserContext} Le `BrowserContext` avec la `Page` finalisée.
             */
            "BrowserType.launchPersistentContext:after": (browserContext) => {
                super.finalize(browserContext[HOOKED_SYMBOL]);
                // eslint-disable-next-line no-param-reassign
                delete browserContext[HOOKED_SYMBOL];
                return browserContext;
            },
        };
    }
}

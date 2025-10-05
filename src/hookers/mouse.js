/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import Hooker from "./hooker.js";

/**
 * @import { Browser, BrowserContext, Page } from "playwright"
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
 * Pointeurs vers les méthodes créant ou récupérant une `Mouse`.
 *
 * @type {Pointers}
 */
const POINTERS = {
    create: [],
    getter: ["Page.mouse:after"],
};

/**
 * Crocheteur pour ajouter des écouteurs dans les objets `Mouse`.
 *
 * @see https://playwright.dev/docs/api/class-mouse
 */
export default class MouseHooker extends Hooker {
    /**
     * Crochets pour écouter toutes les créations d'une `Mouse`.
     *
     * @type {Record<string, Function>}
     */
    static PRESETS = {
        ...Hooker.presets(POINTERS.create),

        "Browser.newPage:after":
            (/** @type {Function} */ listener) =>
            (
                /** @type {Page} */ page,
                /** @type {ContextAfter<Browser>} */ context,
            ) => {
                // eslint-disable-next-line no-param-reassign
                page[HOOKED_SYMBOL] = Hooker.modify(listener)(
                    page[HOOKED_SYMBOL],
                    context,
                );
                return page;
            },

        "BrowserContext.newPage:after":
            (/** @type {Function} */ listener) =>
            (
                /** @type {Page} */ page,
                /** @type {ContextAfter<BrowserContext>} */ context,
            ) => {
                // eslint-disable-next-line no-param-reassign
                page[HOOKED_SYMBOL] = Hooker.modify(listener)(
                    page[HOOKED_SYMBOL],
                    context,
                );
                return page;
            },
    };

    /**
     * Crée un crocheteur pour les `Mouse`.
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
             * Prépare le crochetage de la `Mouse` lors de la création d'une
             * `Page`.
             *
             * @param {Page} page La `Page` créé.
             * @returns {Page} La `Page` avec la `Mouse` prête.
             */
            "Browser.newPage:after": (page) => {
                // eslint-disable-next-line no-param-reassign
                page[HOOKED_SYMBOL] = super.prepare(page.mouse);
                return page;
            },

            /**
             * Prépare le crochetage de la `Mouse` lors de la création d'une
             * `Page`.
             *
             * @param {Page} page La `Page` créé.
             * @returns {Page} La `Page` avec la `Mouse` prête.
             */
            "BrowserContext.newPage:after": (page) => {
                // eslint-disable-next-line no-param-reassign
                page[HOOKED_SYMBOL] = super.prepare(page.mouse);
                return page;
            },
        };
    }

    last() {
        return {
            ...super.last(),

            /**
             * Finalise le crochetage de la `Mouse` lors de la création d'une
             * `Page`.
             *
             * @param {Page} page La `Page` créé.
             * @returns {Page} La `Page` avec la `Mouse` finalisée.
             */
            "Browser.newPage:after": (page) => {
                super.finalize(page[HOOKED_SYMBOL]);
                // eslint-disable-next-line no-param-reassign
                delete page[HOOKED_SYMBOL];
                return page;
            },

            /**
             * Finalise le crochetage de la `Mouse` lors de la création d'une
             * `Page`.
             *
             * @param {Page} page La `Page` créé.
             * @returns {Page} La `Page` avec la `Mouse` finalisée.
             */
            "BrowserContext.newPage:after": (page) => {
                super.finalize(page[HOOKED_SYMBOL]);
                // eslint-disable-next-line no-param-reassign
                delete page[HOOKED_SYMBOL];
                return page;
            },
        };
    }
}

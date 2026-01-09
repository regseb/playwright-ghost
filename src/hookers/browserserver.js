/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import Hooker from "./hooker.js";

/**
 * @import { BrowserServer } from "playwright";
 * @import { Listener } from "../hook.js"
 * @import { Pointers } from "./hooker.js"
 */

/**
 * Pointeurs vers les méthodes créant ou récupérant un `BrowserServer`.
 *
 * @type {Pointers}
 */
const POINTERS = {
    create: ["BrowserType.launchServer:after"],
    getter: [],
};

/**
 * Crocheteur pour ajouter des écouteurs dans les objets `BrowserServer`.
 *
 * @see https://playwright.dev/docs/api/class-browserserver
 */
export default class BrowserServerHooker extends Hooker {
    /**
     * Crochets pour écouter toutes les créations d'un `BrowserServer`.
     *
     * @type {Record<string, Function>}
     */
    static PRESETS = Hooker.presets(POINTERS.create);

    /**
     * Crée un crocheteur pour les `BrowserServer`.
     *
     * @param {Map<string, Map<string, Listener>>} listeners Les écouteurs
     *                                                       regroupés par
     *                                                       objet, propriété et
     *                                                       temporalité.
     */
    constructor(listeners) {
        super(POINTERS, listeners);
    }

    /**
     * Retourne les crochets à exécuter en premier.
     *
     * @returns {Record<string, Function>} Crochets.
     */
    first() {
        return {
            ...super.first(),

            /**
             * Maquille le retour de la méthode (qui est un `EventEmitter`) en
             * `BrowserServer`. Sans ce maquillage, les écouteurs ne peuvent pas
             * s'accrocher à l'objet.
             *
             * @param {Object} eventEmitter Le `EventEmitter` créé.
             * @returns {BrowserServer} Le `EvenEmitter` maquillé en
             *                          `BrowserServer` et crochetable.
             */
            "BrowserType.launchServer:after": (eventEmitter) => {
                const browserServer = new Proxy(eventEmitter, {
                    get(target, prop, receiver) {
                        if ("constructor" === prop) {
                            return {
                                ...Reflect.get(target, prop, receiver),
                                name: "BrowserServer",
                            };
                        }
                        return Reflect.get(target, prop, receiver);
                    },
                });
                return super.prepare(browserServer);
            },
        };
    }
}

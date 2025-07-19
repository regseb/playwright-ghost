/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import hook from "../hook.js";
import mapArrayOrScalar from "../utils/maparrayorscalar.js";

/**
 * @import { ContextAfter, Listener } from "../hook.js"
 */

/**
 * Type des pointeurs vers les méthodes créant ou récupérant un objet.
 *
 * @typedef {Object} Pointers
 * @prop {string[]} create Liste des pointeurs vers les méthodes créant un objet.
 * @prop {string[]} getter Liste des pointers vers les méthodes récupérant un objet.
 */

/**
 * Symbol où sera stocké l'objet vanille.
 *
 * @type {symbol}
 */
const VANILLA_SYMBOL = Symbol("VANILLA");

export default class Hooker {
    /**
     * Crée des crochets qui appellent simplement les écouteurs.
     *
     * @param {string[]} hooks Pointeurs des crochets.
     * @returns {Record<string, Function>} Crochets qui appellent les écouteurs.
     */
    static presets(hooks) {
        return Object.fromEntries(hooks.map((h) => [h, Hooker.modify]));
    }

    /**
     * Crée une fonction qui modifie un objet vanille (en gérant un objet ou une
     * liste d'objets).
     *
     * @param {Function} listener L'écouteur qui sera appeler pour modifier
     *                            l'objet vanille.
     * @returns {Function} La fonction qui modifie l'objet vanille.
     */
    static modify(listener) {
        /**
         * Fonction qui modifie un objet.
         *
         * @template {any|any[]} T Le type de l'objet.
         * @param {T}                 objs    L'objet ou liste d'objets à
         *                                    modifier.
         * @param {ContextAfter<any>} context Le contexte d'exécution de
         *                                    l'écouteur.
         * @returns {T} L'objet ou liste d'objets modifiés.
         */
        return (objs, context) => {
            return mapArrayOrScalar(objs, (obj) =>
                undefined === obj[VANILLA_SYMBOL]
                    ? obj
                    : listener(obj, context),
            );
        };
    }

    /**
     * Mappings entre les objets vanilles et les objets crochetés.
     *
     * @type {WeakMap<any, any>}
     */
    #mappings = new WeakMap();

    /**
     * Pointeurs vers les méthodes créant ou récupérant un objet.
     *
     * @type {Pointers}
     */
    #pointers;

    /**
     * Les écouteurs regroupés par objet, propriété et temporalité.
     *
     * @type {Map<string, Map<string, Listener>>}
     */
    #listeners;

    /**
     * Crée un crocheteur pour un type d'objet.
     *
     * @param {Pointers}                           pointers  Pointeurs vers les
     *                                                       méthodes créant ou
     *                                                       récupérant un
     *                                                       objet.
     * @param {Map<string, Map<string, Listener>>} listeners Les écouteurs
     *                                                       regroupés par
     *                                                       objet, propriété et
     *                                                       temporalité.
     */
    constructor(pointers, listeners) {
        this.#pointers = pointers;
        this.#listeners = listeners;
    }

    /**
     * Retourne les crochets à exécuter en premier.
     *
     * @returns {Record<string, Function>} Crochets.
     */
    first() {
        return {
            ...Object.fromEntries(
                this.#pointers.create.map((h) => [h, this.prepare.bind(this)]),
            ),
            ...Object.fromEntries(
                this.#pointers.getter.map((h) => [h, this.get.bind(this)]),
            ),
        };
    }

    /**
     * Retourne les crochets à exécuter en dernier.
     *
     * @returns {Record<string, Function>} Crochets.
     */
    last() {
        return Object.fromEntries(
            this.#pointers.create.map((h) => [h, this.finalize.bind(this)]),
        );
    }

    /**
     * Prépare un objet ou des objets vanilles pour les crocheter.
     *
     * @param {any|any[]} vanillas Objet ou liste d'objets vanilles à préparer
     *                             pour les crocheter.
     * @returns {any|any[]} Objet ou liste d'objets crochetables.
     */
    prepare(vanillas) {
        return mapArrayOrScalar(vanillas, (vanilla) => {
            if (this.#mappings.has(vanilla)) {
                return this.#mappings.get(vanilla);
            }

            const hooked = hook(
                vanilla,
                this.#listeners.get(vanilla.constructor.name) ?? new Map(),
            );
            hooked[VANILLA_SYMBOL] = vanilla;
            return hooked;
        });
    }

    /**
     * Finalise l'objet ou les objets crochetés.
     *
     * @param {any|any[]} hookeds Objet ou liste d'objets crochetés.
     * @returns {any|any[]} Objet ou liste d'objets crochetés.
     */
    finalize(hookeds) {
        return mapArrayOrScalar(hookeds, (hooked) => {
            if (undefined === hooked[VANILLA_SYMBOL]) {
                return hooked;
            }

            const vanilla = hooked[VANILLA_SYMBOL];
            delete vanilla[VANILLA_SYMBOL];
            this.#mappings.set(vanilla, hooked);
            return hooked;
        });
    }

    /**
     * Récupère l'objet ou les objets crochetés à partir des objets vanilles.
     *
     * @param {any|any[]} vanillas Objet ou liste d'objets vanilles.
     * @returns {any|any[]} Objet ou liste d'objets crochetés associés à la
     *                      vanille.
     */
    get(vanillas) {
        return mapArrayOrScalar(vanillas, (vanilla) => {
            return this.#mappings.get(vanilla) ?? vanilla;
        });
    }
}

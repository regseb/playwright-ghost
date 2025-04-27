/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @template {Object} T Le type de l'objet.
 * @typedef {Object} ContextBefore Le contexte pour un crochetage avant l'appel
 *                                 d'une méthode ou d'un getter.
 * @prop {T}      obj  L'objet crocheté.
 * @prop {string} prop La méthode crochetée.
 * @prop {string} id   L'identifiant de l'exécution d'un crochet. Cette valeur
 *                     est identique dans les crochets d'avant et d'après.
 */

/**
 * @template {Object} T Le type de l'objet.
 * @typedef {Object} ContextAfter Le contexte pour un crochetage après l'appel
 *                                d'une méthode ou d'un getter.
 * @prop {T}               obj  L'objet crocheté.
 * @prop {string}          prop La méthode crochetée.
 * @prop {any[]|undefined} args Les paramètres de la méthode crochetée ou
 *                              possiblement `undefined` pour les getters.
 * @prop {string}          id   L'identifiant de l'exécution d'un crochet. Cette
 *                              valeur est identique dans les crochets d'avant
 *                              et d'après.
 */

/**
 * @typedef {Object} Listener Un écouteur à accrocher à une méthode d'un objet.
 * @prop {Function[]} before Les fonctions à exécuter avant l'appel de la
 *                           méthode.
 * @prop {Function[]} after  Les fonctions à exécuter après l'appel de la
 *                           méthode.
 */

/**
 * L'incrément des identifiants pour chaque appel de crochet.
 *
 * @type {number}
 */
let serial = 0;

/**
 * Exécute des fonctions sur une valeur.
 *
 * @param {Function[]} fns     Les fonctions qui modifieront la valeur.
 * @param {any}        value   La valeur initiale.
 * @param {Object}     context Le contexte fournit aux fonctions.
 * @returns {any} La valeur modifiée par les fonctions.
 */
const reduce = (fns, value, context) => {
    return fns.reduce(
        (v, f) =>
            // Ne pas utiliser await pour ne pas rendre toute la méthode
            // asynchrone. Si la valeur n'est pas une promesse, la valeur de
            // ne doit pas être une promesse.
            // eslint-disable-next-line promise/prefer-await-to-then
            v instanceof Promise ? v.then((w) => f(w, context)) : f(v, context),
        value,
    );
};

/**
 * Accroche des écouteurs à un objet.
 *
 * @template {Object} T Le type de l'objet.
 * @param {T}                            obj       L'objet qui sera crocheté.
 * @param {Map<string|symbol, Listener>} listeners Les écouteurs à accrocher à
 *                                                 l'objet.
 * @returns {T} L'objet crocheté.
 */
export default function hook(obj, listeners) {
    return new Proxy(obj, {
        get: (target, prop, receiver) => {
            const value = target[prop];
            if (!listeners.has(prop)) {
                return "function" === typeof value ? value.bind(target) : value;
            }
            const { before, after } = listeners.get(prop);
            const id = (++serial).toString();

            if ("function" === typeof value) {
                return (/** @type {any[]} */ ...args) => {
                    const argsAltered = reduce(before, args, {
                        // Utiliser le récepteur pour ne pas modifier l'objet
                        // cible.
                        obj: receiver,
                        prop,
                        id,
                    });

                    // Ne pas utiliser await pour ne pas rendre toute la méthode
                    // asynchrone. Si les paramètres ne sont pas une promesse,
                    // la valeur de retour ne doit pas être une promesse.
                    /* eslint-disable promise/prefer-await-to-then */
                    const returnValue =
                        argsAltered instanceof Promise
                            ? argsAltered.then((a) => value.apply(target, a))
                            : value.apply(target, argsAltered);
                    /* eslint-enable promise/prefer-await-to-then */

                    return reduce(after, returnValue, {
                        obj: receiver,
                        prop,
                        args: argsAltered,
                        id,
                    });
                };
            }

            const argsAltered = reduce(before, undefined, {
                obj: receiver,
                prop,
                id,
            });
            return reduce(after, value, {
                obj: receiver,
                prop,
                args: argsAltered,
                id,
            });
        },
    });
}

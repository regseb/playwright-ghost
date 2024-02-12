/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * Accroche des écouteurs à un objet.
 *
 * @template {Object} T Le type de l'objet.
 * @param {T}                   obj        L'objet qui sera crocheté.
 * @param {Map<string, Object>} listeners  Les écouteurs à accrocher à l'objet.
 * @param {Object}              [metadata] Les métadonnées qui seront passées aux écouteurs.
 * @returns {T} L'objet crocheté.
 */
export default function hook(obj, listeners, metadata = {}) {
    return new Proxy(obj, {
        get: (target, prop, receiver) => {
            const value = target[prop];
            if (!listeners.has(prop)) {
                return value instanceof Function ? value.bind(target) : value;
            }
            const { before, after } = listeners.get(prop);

            if (value instanceof Function) {
                return (/** @type {any[]} */ ...args) => {
                    const argsAltered = before.reduce(
                        (a, l) => l(a, { obj: receiver, prop, metadata }),
                        args,
                    );

                    const returnValue = value.apply(target, argsAltered);

                    return after.reduce(
                        (r, l) =>
                            l(r, {
                                obj: receiver,
                                prop,
                                args: argsAltered,
                                metadata,
                            }),
                        returnValue,
                    );
                };
            }

            before.reduce(
                (a, l) => l(a, { obj: receiver, prop, metadata }),
                undefined,
            );
            return after.reduce(
                (r, l) => l(r, { obj: receiver, prop, metadata }),
                value,
            );
        },
    });
}

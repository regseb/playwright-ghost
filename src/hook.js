/**
 * @module
 */

/**
 * @typedef {import("./src/plugin/meta/plugin.js")} Plugin
 */

/**
 * Accroche des plugins à un objet.
 *
 * @param {Object}   obj     L'objet qui sera crocheté.
 * @param {Plugin[]} plugins Les plugins accrochés à l'objet.
 * @returns {Object} L'objet crocheté.
 */
export default function hook(obj, plugins) {
    return new Proxy(obj, {
        get: (target, prop, receiver) => {
            if (target[prop] instanceof Function) {
                const wrap = (...args) => {
                    const argsAltered = plugins.reduce((a, p) => {
                        return p.before(a, {
                            obj: receiver,
                            prop,
                        });
                    }, args);

                    const returnValue = target[prop](...argsAltered);

                    return plugins.reduce((r, p) => {
                        return p.after(r, {
                            obj:  receiver,
                            prop,
                            args: argsAltered,
                        });
                    }, returnValue);
                };
                Object.defineProperty(wrap, "name", {
                    value:        target[prop].name,
                    configurable: true,
                });
                return wrap;
            }

            return target[prop];
        },
    });
}

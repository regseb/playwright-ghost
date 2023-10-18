/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @typedef {import("./plugin/meta/plugin.js")} Plugin
 */

/**
 * Appelle les hooks en amount d'une méthode.
 *
 * @template {any[]} T Les types des paramètres.
 * @param {T}        args            Les paramètres qui devaient être passés à
 *                                   la méthode.
 * @param {Object}   context         Le contexte de la méthode.
 * @param {Object}   context.obj     L'objet de la méthode.
 * @param {string}   context.method  Le nom de la méthode avec son objet.
 * @param {Plugin[]} context.plugins Les plugins contenant les hooks.
 * @returns {T} Les nouveaux paramètres qui seront passés à la méthode.
 */
export const dispatchBefore = function (args, { obj, method, plugins }) {
    const hooks = plugins.flatMap((p) => p.getHooks(`${method}:before`));
    return hooks.reduce((a, h) => h(a, { obj, method }), args);
};

/**
 * Appelle les hooks en aval d'une méthode.
 *
 * @template {any} T Le type de la valeur de retour.
 * @param {T}        returnValue     La valeur de retour qui devaient être
 *                                   retournée.
 * @param {Object}   context         Le contexte de la méthode.
 * @param {Object}   context.obj     L'objet de la méthode.
 * @param {string}   context.method  Le nom de la méthode avec son objet.
 * @param {any[]}    context.args    Les paramètres de la méthode.
 * @param {Plugin[]} context.plugins Les plugins contenant les hooks.
 * @returns {T} La nouvelle valeur de retour qui sera retournée.
 */
export const dispatchAfter = function (
    returnValue,
    { obj, method, args, plugins },
) {
    const hooks = plugins.flatMap((p) => p.getHooks(`${method}:after`));
    if (returnValue instanceof Promise) {
        return hooks.reduce(
            async (r, h) =>
                h(await r, {
                    obj,
                    method,
                    args,
                }),
            returnValue,
        );
    }
    return hooks.reduce((r, h) => h(r, { obj, method, args }), returnValue);
};

/**
 * Accroche des plugins à un objet.
 *
 * @template {Object} T Le type de l'objet.
 * @param {T}        obj     L'objet qui sera crocheté.
 * @param {Plugin[]} plugins Les plugins accrochés à l'objet.
 * @returns {T} L'objet crocheté.
 */
export default function hook(obj, plugins) {
    return new Proxy(obj, {
        get: (target, prop, receiver) => {
            if (target[prop] instanceof Function) {
                const method = `${target.constructor.name}.${prop}`;
                const wrap = (/** @type {any[]} */ ...args) => {
                    const argsAltered = dispatchBefore(args, {
                        obj: receiver,
                        method,
                        plugins,
                    });

                    const returnValue = target[prop](...argsAltered);

                    return dispatchAfter(returnValue, {
                        obj: receiver,
                        method,
                        args: argsAltered,
                        plugins,
                    });
                };
                Object.defineProperty(wrap, "name", {
                    value: prop,
                    configurable: true,
                });
                return wrap;
            }

            return target[prop];
        },
    });
}

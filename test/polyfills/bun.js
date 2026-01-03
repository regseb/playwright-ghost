/**
 * Prothèses pour des APIs de Node.js qui ne sont pas dans Bun.
 *
 * @license MIT
 * @author Sébastien Règne
 */

import { mock as mockNode } from "node:test";
import timers from "node:timers/promises";
// eslint-disable-next-line n/no-missing-import, import/no-unresolved
import { mock as mockBun, setSystemTime, spyOn } from "bun:test";

/**
 * @import { Mock } from "node:test"
 */

/**
 * Le gestionnaire du proxy pour adapter l'API de Bun à celle de Node.js.
 *
 * @type {Object}
 * @see https://bun.com/docs/runtime/nodejs-compat#node%3Atest
 * @see https://github.com/oven-sh/bun/issues/24255
 */
const handler = {
    /**
     * Modifie la propriété `mock` pour qu'elle corresponde à l'API de Node.js.
     *
     * @param {any}    target Une fonction mockée par Bun.
     * @param {string} key    Le nom de la propriété.
     * @returns {any} La valeur de la propriété.
     */
    get(target, key) {
        if ("mock" !== key) {
            return Reflect.get(target, key);
        }
        return {
            callCount: () =>
                target.mock.results.filter((r) => "incomplete" !== r.type)
                    .length,

            get calls() {
                const calls = [];
                for (let i = 0; i < target.mock.calls.length; ++i) {
                    calls.push({
                        arguments: target.mock.calls[i],
                        this: target.mock.contexts[i],
                    });
                }
                return calls;
            },
        };
    },
};

/**
 * Crée un mock de fonction.
 *
 * @param {Function} [implementation] L'implémentation de la fonction mockée.
 * @returns {Mock<Function>} La fonction mockée.
 * @see https://nodejs.org/api/test.html#mockfnoriginal-implementation-options
 */
mockNode.fn = (implementation) => {
    // @ts-expect-error
    return new Proxy(mockBun(implementation), handler);
};

/**
 * Crée un mock pour une méthode d'un objet.
 *
 * @template {Object} T Le type de l'objet.
 * @param {T}                                            object         L'objet
 *                                                                      contenant
 *                                                                      la
 *                                                                      méthode
 *                                                                      à
 *                                                                      mocker.
 * @param {keyof T}                                      methodName     Le nom
 *                                                                      de la
 *                                                                      méthode
 *                                                                      à
 *                                                                      mocker.
 * @param {Extract<T[keyof T], (...args: any[]) => any>} implementation L'implémentation
 *                                                                      de la
 *                                                                      méthode
 *                                                                      mockée.
 * @returns {Mock<Function>} La méthode mockée.
 * @see https://nodejs.org/api/test.html#mockmethodobject-methodname-implementation-options
 */
mockNode.method = (object, methodName, implementation) => {
    // @ts-expect-error
    return new Proxy(
        spyOn(object, methodName).mockImplementation(implementation),
        handler,
    );
};

const properties = [];

mockNode.property = (object, propertyName, value) => {
    properties.push({ object, propertyName, value: object[propertyName] });
    // eslint-disable-next-line no-param-reassign
    object[propertyName] = value;
};

const timeouts = [];

mockNode.timers = {
    enable(options) {
        mockNode.method(globalThis, "setTimeout", (fn, ms, ...args) => {
            timeouts.push({ fn, date: Date.now() + ms, args, active: true });
            return timeouts.length - 1;
        });
        mockNode.method(globalThis, "clearTimeout", (timeoutID) => {
            timeouts[timeoutID].active = false;
        });
        mockNode.method(timers, "setTimeout", (delay, value) => {
            return new Promise((resolve) => {
                timeouts.push({
                    fn: resolve,
                    date: Date.now() + delay,
                    args: [value],
                    active: true,
                });
            });
        });
        setSystemTime(options.now);
    },

    tick(milliseconds = 1) {
        setSystemTime(Date.now() + milliseconds);
        for (const timeout of timeouts) {
            if (timeout.active && Date.now() >= timeout.date) {
                timeout.active = false;
                timeout.fn(...timeout.args);
            }
        }
    },
};

/**
 * Annule les mocks.
 *
 * @see https://nodejs.org/api/test.html#mockreset
 */
mockNode.reset = () => {
    mockBun.restore();

    for (const { object, propertyName, value } of properties) {
        object[propertyName] = value;
    }
    properties.length = 0;

    setSystemTime();
    timeouts.length = 0;
};

/**
 * Prothèses pour des APIs de Node.js qui ne sont pas dans Bun.
 *
 * @license MIT
 * @author Sébastien Règne
 */

import { mock as mockNode } from "node:test";
import timers from "node:timers/promises";
// @ts-expect-error -- TypeScript ne trouve pas les types de module bun.
// eslint-disable-next-line n/no-missing-import, import/no-unresolved
import { mock as mockBun, setSystemTime, spyOn } from "bun:test";

/**
 * @import { Mock, MockPropertyContext } from "node:test"
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
                target.mock.results.filter(
                    (/** @type {any} */ r) => "incomplete" !== r.type,
                ).length,

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
    return new Proxy(
        spyOn(object, methodName).mockImplementation(implementation),
        handler,
    );
};

/**
 * Information d'une propriété mockée.
 *
 * @typedef {Object} PropertyMock
 * @prop {any}                      object       Objet mocké.
 * @prop {string | number | symbol} propertyName Propriété mocké.
 * @prop {any}                      value        Valeur d'origine.
 */

/**
 * Liste des propriétés mockées.
 *
 * @type {PropertyMock[]}
 */
const properties = [];

/**
 * Crée un mock pour une propriété d'un objet.
 *
 * @template {Object}             MockedObject Le type de l'objet.
 * @template {keyof MockedObject} PropertyName Le type de l'objet.
 * @param {MockedObject}               object       L'objet contenant la
 *                                                  propriété à mocker.
 * @param {PropertyName}               propertyName Le nom de la propriété à
 *                                                  mocker.
 * @param {MockedObject[PropertyName]} value        La valeur de la propriété
 *                                                  mockée.
 * @returns {MockedObject & { mock: MockPropertyContext<MockedObject[PropertyName]> }} L'objet mocké.
 * @see https://nodejs.org/api/test.html#mockpropertyobject-propertyname-value
 */
mockNode.property = (object, propertyName, value) => {
    properties.push({ object, propertyName, value: object[propertyName] });
    // eslint-disable-next-line no-param-reassign
    object[propertyName] = value;
    return /** @type {MockedObject & { mock: MockPropertyContext<MockedObject[PropertyName]> }} */ (
        object
    );
};

/**
 * Information d'une timer mocké.
 *
 * @typedef {Object} TimerMock
 * @prop {Function} fn     Fonction qui sera appelée.
 * @prop {number}   date   Horodatage quand la fonction sera appellé.
 * @prop {any[]}    args   Arguments qui seront passés ) la fonction.
 * @prop {boolean}  active Marque indiquant si le mock est actif.
 */

/**
 * Liste des timers mockés.
 *
 * @type {TimerMock[]}
 */
const timeouts = [];

// @ts-expect-error
mockNode.timers = {
    /**
     * Active un mock sur les timers.
     *
     * @param {Object} [options]     Options du mock.
     * @param {number} [options.now] Horodatage mocké.
     * @see https://nodejs.org/api/test.html#timersenableenableoptions
     */
    enable(options) {
        mockNode.method(
            globalThis,
            "setTimeout",
            (
                /** @type {Function} */ fn,
                /** @type {number} */ ms,
                /** @type {any[]} */ ...args
            ) => {
                timeouts.push({
                    fn,
                    date: Date.now() + ms,
                    args,
                    active: true,
                });
                return timeouts.length - 1;
            },
        );
        mockNode.method(
            globalThis,
            "clearTimeout",
            (/** @type {number} */ timeoutID) => {
                timeouts[timeoutID].active = false;
            },
        );
        mockNode.method(
            timers,
            "setTimeout",
            (/** @type {number} */ delay, /** @type {any} */ value) => {
                return new Promise((resolve) => {
                    timeouts.push({
                        fn: resolve,
                        date: Date.now() + delay,
                        args: [value],
                        active: true,
                    });
                });
            },
        );
        setSystemTime(options?.now);
    },

    /**
     * Avance dans le temps mocké.
     *
     * @param {number} [milliseconds] Nombre de millisecondes à avancer. `1` par
     *                                défaut.
     * @see https://nodejs.org/api/test.html#timerstickmilliseconds
     */
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

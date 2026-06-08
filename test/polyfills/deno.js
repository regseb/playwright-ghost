/**
 * Prothèses pour des APIs de Node.js qui ne sont pas dans Deno.
 *
 * @license MIT
 * @author Sébastien Règne
 */

import { mock } from "node:test";
import timers from "node:timers/promises";
import { FakeTime } from "@std/testing/time";

/**
 * @import { MockPropertyContext } from "node:test"
 */

/**
 * Mock du temps.
 *
 * @type {FakeTime}
 */
let fakeTime;

/**
 * Active un mock sur les timers.
 *
 * @param {Object} [options]     Options du mock.
 * @param {number} [options.now] Horodatage mocké.
 * @see https://nodejs.org/api/test.html#timersenableenableoptions
 * @see https://github.com/denoland/deno/issues/32987
 * @see https://github.com/denoland/std/issues/7177
 */
mock.timers.enable = (options) => {
    fakeTime = new FakeTime(options?.now ?? 0);

    mock.method(
        timers,
        "setTimeout",
        (/** @type {number} */ delay, /** @type {any} */ value) => {
            return new Promise((resolve) => {
                setTimeout(resolve, delay, value);
            });
        },
    );

    mock.method(
        globalThis,
        "queueMicrotask",
        async (/** @type {Function} */ callback) => {
            await fakeTime.runMicrotasks();
            callback();
        },
    );
};

/**
 * Avance dans le temps mocké.
 *
 * @param {number} [milliseconds] Nombre de millisecondes à avancer. `1` par
 *                                défaut.
 * @see https://nodejs.org/api/test.html#timerstickmilliseconds
 */
mock.timers.tick = (milliseconds = 1) => {
    fakeTime.tick(milliseconds);
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
 * @see https://github.com/denoland/deno/issues/34950
 */
mock.property = (object, propertyName, value) => {
    properties.push({ object, propertyName, value: object[propertyName] });
    // eslint-disable-next-line no-param-reassign
    object[propertyName] = value;
    return /** @type {MockedObject & { mock: MockPropertyContext<MockedObject[PropertyName]> }} */ (
        object
    );
};

const resetNative = mock.reset;

/**
 * Annule les mocks.
 *
 * @see https://nodejs.org/api/test.html#mockreset
 */
mock.reset = () => {
    resetNative();

    for (const { object, propertyName, value } of properties) {
        object[propertyName] = value;
    }
    properties.length = 0;

    if (undefined !== fakeTime) {
        fakeTime[Symbol.dispose]();
        fakeTime = undefined;
    }
};

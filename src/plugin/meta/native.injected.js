/**
 * Faire des copies des variables globales pour ne pas utiliser de variables qui
 * ont (ou seront) peut-être été modifiées.
 *
 * @module
 */

const snapshot = (obj, props) => {
    const clone = globalThis.Object.fromEntries(
        props.filter((p) => !p.startsWith("prototype.")).map((prop) => [
            prop,
            obj[prop] instanceof Function ? obj[prop].bind(obj)
                                          : obj[prop],
        ]),
    );

    clone.prototype = globalThis.Object.fromEntries(
        props.filter((p) => p.startsWith("prototype.")).map((p) => p.slice(9)
                                                       .map((prop) => {
            const fn = obj.prototype[prop];
            return [
                prop,
                (thisArg, args) => fn.apply(thisArg, args),
            ];
        })),
    );

    return clone;
};

const ReflectNative = globalThis.Reflect;
// FIXME Signaler à ESLint que la méthode exported ne fonctionne pas.
/* exported Reflect */
const Reflect = snapshot(ReflectNative, [
    "apply",
    "get",
    "getOwnPropertyDescriptor",
    "setPrototypeOf",
    "set",
]);

const ObjectNative = globalThis.Object;
/* exported Object */
const Object = snapshot(ObjectNative, [
    "create",
    "defineProperty",
    "freeze",
    "entries",
    "getOwnPropertyDescriptor",
    "getOwnPropertyDescriptors",
    "getOwnPropertyNames",
    "getPrototypeOf",
    "preventExtensions",
    "seal",
    "setPrototypeOf",
]);

const NumberNative = globalThis.Number;
/* exported Number */
const Number = snapshot(NumberNative, [
    "isNaN",
    "isFinite",
    "parseFloat",
]);

const MathNative = globalThis.Math;
/* exported Math */
const Math = snapshot(MathNative, ["trunc"]);

const performanceNative = globalThis.performance;
/* exported performance */
const performance = snapshot(performanceNative, [
    "getEntriesByName",
    "getEntriesByType",
    "now",
    "timeOrigin",
]);

const navigatorNative = globalThis.navigator;
/* exported performance */
const navigator = snapshot(navigatorNative, [
    "userAgent",
    "vendor",
]);

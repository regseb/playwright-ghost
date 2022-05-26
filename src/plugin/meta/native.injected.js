const snapshot = (obj, props) => {
    return window.Object.fromEntries(props.map((prop) => {
        return [prop, obj[prop].bind(obj)];
    }));
};

// Créer des versions locales de variables globales.
const ReflectNative = window.Reflect;
const Reflect = snapshot(ReflectNative, [
    "apply",
    "get",
    "getOwnPropertyDescriptor",
    "setPrototypeOf",
    "set",
]);
const ReflectLocal = Reflect;

const ObjectNative = window.Object;
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
const ObjectLocal = Object;

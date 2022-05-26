/* global importMeta */
const options = importMeta.arguments;

Ghost.defineProperty(NavigatorUAData, "brands", {
    get() {
        return ObjectLocal.freeze(
               ObjectLocal.preventExtensions(
               ObjectLocal.seal([
            { brand: " Not A;Brand", version: "99" },
            { brand: "Chromium",     version: options.version },
        ])));
    },
});

Ghost.defineProperty(NavigatorUAData, "toJSON", {
    value(_target, thisArg) {
        return {
            brands: thisArg.brands,
            mobile: thisArg.mobile,
        };
    },
});

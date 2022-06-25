/* global importMeta */
const options = importMeta.arguments;

Ghost.defineProperty(NavigatorUAData, "brands", {
    get() {
        return Object.freeze(Object.preventExtensions(Object.seal([
            { brand: "Chromium",     version: options.version },
            { brand: ".Not/A)Brand", version: "99" },
        ])));
    },
});

Ghost.defineProperty(NavigatorUAData, "platform", {
    get() {
        return options.platform;
    },
});

Ghost.defineProperty(NavigatorUAData, "toJSON", {
    value(_target, thisArg) {
        return {
            brands:   thisArg.brands,
            mobile:   thisArg.mobile,
            platform: thisArg.platform,
        };
    },
});

/* global importMeta */
const options = importMeta.arguments;

Ghost.defineProperty(NavigatorUAData, "brands", {
    get() {
        return Object.freeze(Object.preventExtensions(Object.seal([
            { brand: "Not?A_Brand", version: "8" },
            { brand: "Chromium",    version: options.version },
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

/* global importMeta */
const options = importMeta.arguments;

Ghost.defineProperty(Navigator, "maxTouchPoints", {
    get() {
        return options.maxTouchPoints;
    },
});

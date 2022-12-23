/* global jsondiffpatch */

globalThis.assert = {
    equal(actual, expected) {
        const diff = jsondiffpatch.diff(actual, expected);
        if (undefined !== diff) {
            throw new Error(JSON.stringify(diff));
        }
    },

    deepEqual(actual, expected) {
        const diff = jsondiffpatch.diff(actual, expected);
        if (undefined !== diff) {
            throw new Error(JSON.stringify(diff));
        }
    },
};

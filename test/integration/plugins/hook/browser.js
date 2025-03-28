/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import vanilla from "../../../../src/index.js";

/**
 * @import { Browser } from "playwright";
 */

describe("Plugin: hook.browser", function () {
    it("should add plugin in Browser", async function () {
        const browser = await vanilla.chromium.launch({
            plugins: [
                {
                    "Browser:new": (/** @type {Browser} */ vanillaBrowser) => {
                        // eslint-disable-next-line no-param-reassign
                        vanillaBrowser.foo = "bar";
                        return vanillaBrowser;
                    },
                },
            ],
        });
        try {
            assert.equal(browser.foo, "bar");
        } finally {
            await browser.close();
        }
    });
});

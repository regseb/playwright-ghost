/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import vanilla from "../../../../src/index.js";

/**
 * @import { Browser } from "playwright";
 */

describe("Plugin: hook.browser", () => {
    it("should add plugin in Browser", async () => {
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

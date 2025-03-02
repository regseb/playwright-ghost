/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import vanilla from "../../../../src/index.js";

describe("Plugin: hook.browser", function () {
    it("should add plugin in Browser", async function () {
        const browser = await vanilla.chromium.launch({
            plugins: [
                {
                    "Browser:new": (vanillaBrowser) => {
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

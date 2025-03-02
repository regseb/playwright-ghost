/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import vanilla from "../../../../src/index.js";

describe("Plugin: hook.browserContext", function () {
    it("should add plugin in BrowserContext", async function () {
        const browser = await vanilla.chromium.launch({
            plugins: [
                {
                    "BrowserContext:new": (vanillaBrowserContext) => {
                        // eslint-disable-next-line no-param-reassign
                        vanillaBrowserContext.foo = "bar";
                        return vanillaBrowserContext;
                    },
                },
            ],
        });
        const context = await browser.newContext();
        try {
            assert.equal(context.foo, "bar");
        } finally {
            await context.close();
            await browser.close();
        }
    });
});

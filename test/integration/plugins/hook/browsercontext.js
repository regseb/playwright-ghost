/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import vanilla from "../../../../src/index.js";

/**
 * @import { BrowserContext } from "playwright";
 */

describe("Plugin: hook.browserContext", function () {
    it("should add plugin in BrowserContext", async function () {
        const browser = await vanilla.chromium.launch({
            plugins: [
                {
                    "BrowserContext:new": (
                        /** @type {BrowserContext} */ browserContext,
                    ) => {
                        // eslint-disable-next-line no-param-reassign
                        browserContext.foo = "bar";
                        return browserContext;
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

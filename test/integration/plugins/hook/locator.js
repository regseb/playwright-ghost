/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import vanilla from "../../../../src/index.js";

describe("Plugin: hook.locator", function () {
    it("should add plugin in Locator", async function () {
        const browser = await vanilla.chromium.launch({
            plugins: [
                {
                    "Locator:new": (locator) => {
                        // eslint-disable-next-line no-param-reassign
                        locator.foo = "bar";
                        return locator;
                    },
                },
            ],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto("about:blank");
            const locator = page.locator("html");
            assert.equal(locator.foo, "bar");
        } finally {
            await context.close();
            await browser.close();
        }
    });
});

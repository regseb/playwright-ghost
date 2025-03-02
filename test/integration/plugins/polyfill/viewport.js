/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import vanilla from "../../../../src/index.js";

describe("Plugin: polyfill.viewport", function () {
    it("should set viewport size", async function () {
        const browser = await vanilla.chromium.launch({
            channel: "chromium",
            plugins: [
                vanilla.plugins.polyfill.viewport({
                    width: { min: 1234, max: 1234 },
                    height: { min: 567, max: 567 },
                }),
            ],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto("about:blank");
            assert.equal(await page.evaluate("innerWidth"), 1234);
            assert.equal(await page.evaluate("innerHeight"), 567);
        } finally {
            await context.close();
            await browser.close();
        }
    });
});

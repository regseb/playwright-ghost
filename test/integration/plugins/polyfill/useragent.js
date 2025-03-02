/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import vanilla from "../../../../src/index.js";

describe("Plugin: polyfill.userAgent", function () {
    it("should return new user agent", async function () {
        const browser = await vanilla.chromium.launch({
            channel: "chromium",
            plugins: [vanilla.plugins.polyfill.userAgent({ userAgent: "foo" })],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto("about:blank");
            assert.equal(await page.evaluate("navigator.userAgent"), "foo");
        } finally {
            await context.close();
            await browser.close();
        }
    });
});

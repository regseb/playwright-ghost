/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import vanilla from "../../../../src/index.js";

describe("Plugin: polyfill.headless", function () {
    it("should use new headless", async function () {
        const browser = await vanilla.chromium.launch({
            plugins: [vanilla.plugins.polyfill.headless()],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto("about:blank");
            assert.notEqual(await page.evaluate("navigator.plugins.length"), 0);
            assert.notEqual(
                await page.evaluate("navigator.mimeTypes.length"),
                0,
            );
        } finally {
            await context.close();
            await browser.close();
        }
    });
});

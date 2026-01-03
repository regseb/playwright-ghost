/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import playwright from "../../../../src/index.js";
import polyfillHeadlessPlugin from "../../../../src/plugins/polyfill/headless.js";

describe("Plugin: polyfill.headless", () => {
    it("should use new headless", async () => {
        const browser = await playwright.chromium.launch({
            plugins: [polyfillHeadlessPlugin()],
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

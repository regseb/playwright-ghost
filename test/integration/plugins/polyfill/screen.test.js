/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import playwright from "../../../../src/index.js";
import polyfillScreenPlugin from "../../../../src/plugins/polyfill/screen.js";

describe("Plugin: polyfill.screen", () => {
    it("should set screen size", async () => {
        const browser = await playwright.chromium.launch({
            plugins: [polyfillScreenPlugin()],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto("about:blank");
            assert.equal(await page.evaluate("screen.width"), 1920);
            assert.equal(await page.evaluate("screen.height"), 1080);
        } finally {
            await context.close();
            await browser.close();
        }
    });
});

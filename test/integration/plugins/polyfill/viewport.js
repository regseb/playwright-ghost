/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import playwright from "../../../../src/index.js";
import viewportPlugin from "../../../../src/plugins/polyfill/viewport.js";

describe("Plugin: polyfill.viewport", () => {
    it("should set viewport size", async () => {
        const browser = await playwright.chromium.launch({
            plugins: [
                viewportPlugin({
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

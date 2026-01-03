/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import playwright from "../../../../src/index.js";
import polyfillWebdriverPlugin from "../../../../src/plugins/polyfill/webdriver.js";

describe("Plugin: polyfill.webdriver", () => {
    it("should return false", async () => {
        const browser = await playwright.chromium.launch({
            plugins: [polyfillWebdriverPlugin()],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto("about:blank");
            assert.equal(await page.evaluate("navigator.webdriver"), false);
        } finally {
            await context.close();
            await browser.close();
        }
    });
});

/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import playwright from "../../../../src/index.js";
import adblockerPlugin from "../../../../src/plugins/utils/adblocker.js";

describe("Plugin: utils.adblocker", () => {
    it("should remove ads", async () => {
        const browser = await playwright.chromium.launch({
            plugins: [adblockerPlugin()],
        });
        const context = await browser.newContext();
        try {
            const page = await context.newPage();
            await page.goto("https://adblock-tester.com/");

            const score = await page
                .locator(".final-score-value")
                .textContent();
            assert.ok(90 < Number(score), `90 < ${score}`);
        } finally {
            await context.close();
            await browser.close();
        }
    });
});

/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import vanilla from "../../../../src/index.js";

describe("Plugin: utils.adblocker", () => {
    it("should remove ads", async () => {
        const browser = await vanilla.chromium.launch({
            plugins: [vanilla.plugins.utils.adblocker()],
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

/**
 * @license MIT
 * @see https://antcpt.com/score_detector/
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import playwright from "../../../src/index.js";
import plugins from "../../../src/plugins/index.js";

const getUserAgent = async () => {
    const browser = await playwright.chromium.launch({
        plugins: plugins.recommended(),
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Anti-bot: Score detector (reCAPTCHA v3)", () => {
    describe("chromium", () => {
        it("should be 0.7 (or plus)", async () => {
            const browser = await playwright.chromium.launch({
                plugins: [
                    ...plugins.recommended(),
                    plugins.polyfill.userAgent({
                        userAgent: await getUserAgent(),
                    }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://antcpt.com/score_detector/");

                const results = await page
                    .locator('big:has-text("Your score is:")')
                    .textContent();
                const score = Number.parseFloat(results.trim().slice(15));

                assert.ok(0.7 <= score, `0.7 <= ${score}`);
            } finally {
                await page.screenshot({
                    path: "./log/scoredetector-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/scoredetector-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});

/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vanilla from "../../../src/index.js";

const getUserAgent = async () => {
    const browser = await vanilla.chromium.launch({ channel: "chromium" });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Anti-bot: Score detector (reCAPTCHA v3)", function () {
    describe("chromium", function () {
        it("should be 0.7 (or plus)", async function () {
            const browser = await vanilla.chromium.launch({
                plugins: [
                    ...vanilla.plugins.recommended(),
                    vanilla.plugins.polyfill.userAgent({
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

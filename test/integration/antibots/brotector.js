/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import patchright from "../../../src/patchright.js";

describe("Anti-bot: Brotector", function () {
    describe("chromium", function () {
        it("should have 0", async function () {
            const browser = await patchright.chromium.launch({
                plugins: patchright.plugins.recommended(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://kaliiiiiiiiii.github.io/brotector/");
                await page.locator("#clickHere").click();
                await page.waitForTimeout(1000);
                const score = await page.locator("#avg-score").textContent();
                assert.equal(score, "0");
            } finally {
                await page.screenshot({
                    path: "./log/brotector-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/brotector-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});

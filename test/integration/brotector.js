/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vanilla from "../../src/index.js";
import rebrowser from "../../src/rebrowser.js";

const getUserAgent = async () => {
    const browser = await vanilla.chromium.launch({
        args: ["--headless=new"],
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Brotector", function () {
    describe("chromium", function () {
        it("should have 0", async function () {
            const browser = await rebrowser.chromium.launch({
                plugins: [
                    ...rebrowser.plugins.recommended(),
                    rebrowser.plugins.polyfill.userAgent({
                        userAgent: await getUserAgent(),
                    }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                // Désactiver le test qui fait crasher Chromium.
                // https://github.com/kaliiiiiiiiii/brotector#popupcrash
                // https://issues.chromium.org/340836884
                await page.goto(
                    "https://kaliiiiiiiiii.github.io/brotector/?crash=false",
                );
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

    describe("firefox", function () {
        it("should have 0", async function () {
            const browser = await vanilla.firefox.launch({
                plugins: vanilla.plugins.recommended(),
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
                    path: "./log/brotector-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/brotector-fx.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});

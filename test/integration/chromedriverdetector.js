/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import playwright from "playwright";
import { chromium, plugins } from "../../src/index.js";

const getUserAgent = async () => {
    const browser = await playwright.chromium.launch({
        args: ["--headless=new"],
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Chromedriver Detector", function () {
    describe("chromium", function () {
        it("should passed", async function () {
            const browser = await chromium.launch({
                plugins: [
                    ...plugins.recommendeds(),
                    plugins.polyfill.userAgent({
                        userAgent: await getUserAgent(),
                    }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://hmaker.github.io/selenium-detector/");
                // Récupérer les tokens.
                const tokens = await page.evaluate(async () => ({
                    /* eslint-disable no-undef */
                    token: window.token,
                    asyncToken: await window.getAsyncToken(),
                    /* eslint-enable no-undef */
                }));

                await page.locator("#chromedriver-token").fill(tokens.token);
                await page
                    .locator("#chromedriver-asynctoken")
                    .fill(tokens.asyncToken);
                await page.locator("#chromedriver-test").click();

                const result = await page.locator(".test-status").textContent();
                assert.equal(result, "Passed!");
            } catch (err) {
                await page.screenshot({
                    path: "./log/chromedriverdetector-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/chromedriverdetector-cr.html",
                    await page.content(),
                );

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
    });
});

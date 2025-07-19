/**
 * @license MIT
 * @see https://hmaker.github.io/selenium-detector/
 * @see https://github.com/HMaker/HMaker.github.io/tree/HEAD/selenium-detector
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import patchright from "../../../src/patchright.js";
import plugins from "../../../src/plugins/index.js";

const getUserAgent = async () => {
    const browser = await patchright.chromium.launch({
        plugins: plugins.recommended(),
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Anti-bot: Chromedriver Detector", () => {
    describe("chromium", () => {
        it("should passed", async () => {
            const browser = await patchright.chromium.launch({
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
                await page.goto("https://hmaker.github.io/selenium-detector/");
                // Récupérer les tokens.
                const tokens = await page.evaluate(
                    async () => ({
                        token: globalThis.token,
                        asyncToken: await globalThis.getAsyncToken(),
                    }),
                    [],
                    false,
                );

                await page.locator("#chromedriver-token").fill(tokens.token);
                await page
                    .locator("#chromedriver-asynctoken")
                    .fill(tokens.asyncToken);
                await page.locator("#chromedriver-test").click();

                const result = await page.locator(".test-status").textContent();
                assert.equal(result, "Passed!");
            } finally {
                await page.screenshot({
                    path: "./log/chromedriverdetector-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/chromedriverdetector-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});

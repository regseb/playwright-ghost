import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "../../src/index.js";

describe("Chromedriver Detector", function () {
    describe("chromium", function () {
        it.skip("should passed", async function () {
            const browser = await chromium.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://hmaker.github.io/selenium-detector/");
                // Récupérer les tokens.
                const tokens = await page.evaluate(async () => ({
                    /* eslint-disable no-undef */
                    token:      window.token,
                    asyncToken: await window.getAsyncToken(),
                    /* eslint-enable no-undef */
                }));

                await page.locator("#chromedriver-token").fill(tokens.token);
                await page.locator("#chromedriver-asynctoken")
                          .fill(tokens.asyncToken);
                await page.locator("#chromedriver-test").click();

                const result = await page.locator(".test-status").textContent();
                assert.equal(result, "Passed!");
            } catch (err) {
                await page.screenshot({
                    path:     "./log/chromedriverdetector-cr.png",
                    fullPage: true,
                });
                await fs.writeFile("./log/chromedriverdetector-cr.html",
                                   await page.content());

                throw err;
            } finally {
                await context.close();
                await browser.close();
            }
        });
    });
});

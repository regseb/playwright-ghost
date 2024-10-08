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

describe("Chromedriver Detector", function () {
    describe("chromium", function () {
        it("should passed", async function () {
            const browser = await rebrowser.chromium.launch({
                plugins: [
                    ...rebrowser.plugins.recommendeds(),
                    rebrowser.plugins.polyfill.userAgent({
                        userAgent: await getUserAgent(),
                    }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                // Contourner l'isolation des scripts.
                // https://rebrowser.net/blog/how-to-access-main-context-objects-from-isolated-context-in-puppeteer-and-playwright-23741
                await page.addInitScript(() => {
                    globalThis.addEventListener("message", async (event) => {
                        if ("tokens" === event.data) {
                            globalThis.postMessage({
                                token: globalThis.token,
                                asyncToken: await globalThis.getAsyncToken(),
                            });
                        }
                    });
                });

                await page.goto("https://hmaker.github.io/selenium-detector/");

                // Récupérer les tokens.
                const tokens = await page.evaluate(() => {
                    return new Promise((resolve) => {
                        globalThis.addEventListener("message", (event) => {
                            if ("tokens" !== event.data) {
                                resolve(event.data);
                            }
                        });
                        globalThis.postMessage("tokens");
                    });
                });

                await page.locator("#chromedriver-token").fill(tokens.token);
                await page
                    .locator("#chromedriver-asynctoken")
                    .fill(tokens.asyncToken);
                await page.locator("#chromedriver-test").click();

                const result = await page.locator(".test-status").textContent();
                // Le test échoue car Chromedriver Detector détecte
                // l'utilisation des DevTools.
                // https://issues.chromium.org/issues/40073683
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

    describe("firefox", function () {
        it("should passed", async function () {
            const browser = await vanilla.firefox.launch({
                plugins: vanilla.plugins.recommendeds(),
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://hmaker.github.io/selenium-detector/");
                // Récupérer les tokens.
                const tokens = await page.evaluate(async () => ({
                    token: globalThis.token,
                    asyncToken: await globalThis.getAsyncToken(),
                }));

                await page.locator("#chromedriver-token").fill(tokens.token);
                await page
                    .locator("#chromedriver-asynctoken")
                    .fill(tokens.asyncToken);
                await page.locator("#chromedriver-test").click();

                const result = await page.locator(".test-status").textContent();
                assert.equal(result, "Passed!");
            } finally {
                await page.screenshot({
                    path: "./log/chromedriverdetector-fx.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/chromedriverdetector-fx.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});

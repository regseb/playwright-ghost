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
        executablePath: playwright.chromium.executablePath(),
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("FingerprintJS", function () {
    describe("chromium", function () {
        it("should not be detected", async function () {
            const browser = await chromium.launch({
                plugins: [
                    ...plugins.recommendedPlugins(),
                    plugins.polyfill.userAgentPlugin({
                        userAgent: await getUserAgent(),
                    }),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto(
                    "https://fingerprintjs.com/products/bot-detection/",
                );

                // Attendre les résultats.
                await page.waitForSelector(
                    'div[class^="HeroSection-module--card--"]' +
                        ' h3:has-text("Automation Tool")',
                );
                await page.waitForSelector(
                    'div[class^="HeroSection-module--card--"]' +
                        ' h3:has-text("Search Engine")',
                );

                const selector = 'div[class^="HeroSection-module--card--"]';
                const results = await page
                    .locator(selector)
                    .evaluateAll((divs) => {
                        return divs.map((div) => ({
                            name: div.querySelector("h3").textContent,
                            status: div.querySelector("p").textContent,
                        }));
                    });

                for (const result of results) {
                    assert.equal(result.status, "Not detected", result.name);
                }
            } catch (err) {
                await page.screenshot({
                    path: "./log/fingerprintjs-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/fingerprintjs-cr.html",
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

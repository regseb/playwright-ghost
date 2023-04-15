/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "../../src/index.js";

describe("FingerprintJS", function () {
    describe("chromium", function () {
        it("should not be detected", async function () {
            const browser = await chromium.launch();
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

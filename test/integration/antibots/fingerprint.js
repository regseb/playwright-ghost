/**
 * @license MIT
 * @see https://fingerprint.com/products/bot-detection/
 * @see https://demo.fingerprint.com/playground
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
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

describe("Anti-bot: Fingerprint", () => {
    describe("chromium", () => {
        it("should not be detected", async () => {
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
                await page.goto(
                    "https://fingerprint.com/products/bot-detection/",
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
                            name: div.querySelector("h3")?.textContent,
                            status: div.querySelector("p")?.textContent,
                        }));
                    });

                for (const result of results) {
                    assert.equal(result.status, "Not detected", result.name);
                }
            } finally {
                await page.screenshot({
                    path: "./log/fingerprint-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/fingerprint-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });

        it("should not be detected in playground", async () => {
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
                await page.goto("https://demo.fingerprint.com/playground");

                const result = await page
                    .locator('div[data-test-property-name="botd"]')
                    .textContent();

                assert.equal(result, "Not detected");
            } finally {
                await page.screenshot({
                    path: "./log/fingerprintplayground-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/fingerprintplayground-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});

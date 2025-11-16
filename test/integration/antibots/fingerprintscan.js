/**
 * @license MIT
 * @see https://fingerprint-scan.com/
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

describe("Anti-bot: Fingerprint-Scan", () => {
    describe("chromium", () => {
        it("should not be detected", async () => {
            const browser = await patchright.chromium.launch({
                plugins: [
                    ...plugins.recommended(),
                    plugins.polyfill.userAgent({
                        userAgent: await getUserAgent(),
                    }),
                    plugins.polyfill.webGL(),
                ],
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await page.goto("https://fingerprint-scan.com/");

                // Ne pas vérifier le fingerprintScore, car l'API
                // https://fingerprint-scan.com/api/score retourne une erreur
                // 400.
                const webDriver = await page
                    .locator("tr:has(.property-name)", {
                        has: page.getByText("WebDriver"),
                    })
                    .locator(".property-value")
                    .first()
                    .textContent();
                assert.equal(webDriver, "false", "WebDriver");

                const isSeleniumChrome = await page
                    .locator("tr:has(.property-name)", {
                        has: page.getByText("Is Selenium Chrome"),
                    })
                    .locator(".property-value")
                    .first()
                    .textContent();
                assert.equal(isSeleniumChrome, "false", "Is Selenium Chrome");

                const cdpCheck = await page
                    .locator("tr:has(.property-name)", {
                        has: page.getByText("CDP Check"),
                    })
                    .locator(".property-value")
                    .first()
                    .textContent();
                assert.equal(cdpCheck, "false", "CDP Check");

                const isPlaywright = await page
                    .locator("tr:has(.property-name)", {
                        has: page.getByText("Is Playwright"),
                    })
                    .locator(".property-value")
                    .first()
                    .textContent();
                assert.equal(isPlaywright, "false", "Is Playwright");
            } finally {
                await page.screenshot({
                    path: "./log/fingerprintscan-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/fingerprintscan-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});

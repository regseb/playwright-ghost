/**
 * @license MIT
 * @see https://pixelscan.net/fingerprint-check
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { describe, it } from "node:test";
import playwright from "../../../src/index.js";
import plugins from "../../../src/plugins/index.js";

const getUserAgent = async () => {
    const browser = await playwright.chromium.launch({
        plugins: plugins.recommended(),
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const userAgent = await page.evaluate("navigator.userAgent");
    await context.close();
    await browser.close();
    return userAgent.replace("Headless", "");
};

describe("Anti-bot: Pixelscan", () => {
    describe("chromium", () => {
        it("should not detected", async () => {
            const browser = await playwright.chromium.launch({
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
                await page.goto("https://pixelscan.net/fingerprint-check");

                const result = await page
                    .locator("pxlscn-bot-detection span")
                    .textContent();
                assert.equal(
                    result?.trim(),
                    "No automation framework detected",
                );
            } finally {
                await page.screenshot({
                    path: "./log/pixelscan-cr.png",
                    fullPage: true,
                });
                await fs.writeFile(
                    "./log/pixelscan-cr.html",
                    await page.content(),
                );

                await context.close();
                await browser.close();
            }
        });
    });
});
